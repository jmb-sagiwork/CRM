import { createHash } from "node:crypto";
import pg from "pg";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

async function withDatabase<T>(callback: (database: pg.Client) => Promise<T>) {
  if (!process.env.POSTGRES_URL) throw new Error("POSTGRES_URL is not configured.");

  const connectionUrl = new URL(process.env.POSTGRES_URL);
  connectionUrl.searchParams.delete("sslmode");
  connectionUrl.searchParams.delete("sslrootcert");
  const database = new pg.Client({
    connectionString: connectionUrl.toString(),
    ssl: { rejectUnauthorized: false },
  });

  await database.connect();
  try {
    await database.query(`
      create table if not exists public.auth_login_attempts (
        username text not null,
        client_key text not null,
        failed_attempts integer not null default 0,
        locked_until timestamptz,
        updated_at timestamptz not null default now(),
        primary key (username, client_key)
      );
    `);
    return await callback(database);
  } finally {
    await database.end();
  }
}

export function loginClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = request.headers.get("user-agent") || "unknown";
  return createHash("sha256").update(`${forwardedFor || "unknown"}:${userAgent}`).digest("hex");
}

export async function getLoginLockout(username: string, clientKey: string) {
  return withDatabase(async database => {
    const result = await database.query<{ locked_until: Date | null }>(
      `select locked_until
       from public.auth_login_attempts
       where username = $1 and client_key = $2`,
      [username, clientKey],
    );
    const lockedUntil = result.rows[0]?.locked_until;
    return lockedUntil && lockedUntil.getTime() > Date.now() ? lockedUntil : null;
  });
}

export async function recordFailedLogin(username: string, clientKey: string) {
  return withDatabase(async database => {
    const result = await database.query<{ failed_attempts: number; locked_until: Date | null }>(
      `insert into public.auth_login_attempts (username, client_key, failed_attempts, locked_until)
       values ($1, $2, 1, null)
       on conflict (username, client_key) do update set
         failed_attempts = case
           when auth_login_attempts.locked_until is not null and auth_login_attempts.locked_until <= now()
             then 1
           else auth_login_attempts.failed_attempts + 1
         end,
         locked_until = case
           when (
             case
               when auth_login_attempts.locked_until is not null and auth_login_attempts.locked_until <= now()
                 then 1
               else auth_login_attempts.failed_attempts + 1
             end
           ) >= $3
             then now() + ($4 * interval '1 minute')
           else auth_login_attempts.locked_until
         end,
         updated_at = now()
       returning failed_attempts, locked_until`,
      [username, clientKey, MAX_FAILED_ATTEMPTS, LOCKOUT_MINUTES],
    );

    return result.rows[0];
  });
}

export async function clearFailedLogins(username: string, clientKey: string) {
  return withDatabase(async database => {
    await database.query(
      "delete from public.auth_login_attempts where username = $1 and client_key = $2",
      [username, clientKey],
    );
  });
}

