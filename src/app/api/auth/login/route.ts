import { NextResponse } from "next/server";
import { z } from "zod";

import {
  clearFailedLogins,
  getLoginLockout,
  loginClientKey,
  recordFailedLogin,
} from "@/lib/auth/login-attempts";
import { verifyPassword } from "@/lib/auth/passwords";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from "@/lib/auth/session";

export const runtime = "nodejs";

const LoginSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(500),
});

function lockedResponse(lockedUntil: Date) {
  return NextResponse.json(
    {
      error: "Too many failed login attempts. Try again later.",
      lockedUntil: lockedUntil.toISOString(),
    },
    { status: 429 },
  );
}

export async function POST(request: Request) {
  try {
    const input = LoginSchema.parse(await request.json());
    const username = input.username.toLowerCase();
    const clientKey = loginClientKey(request);
    const existingLockout = await getLoginLockout(username, clientKey);
    if (existingLockout) return lockedResponse(existingLockout);

    const authenticatedUsername = await verifyPassword(username, input.password);
    if (!authenticatedUsername) {
      const failedAttempt = await recordFailedLogin(username, clientKey);
      if (failedAttempt.locked_until && failedAttempt.locked_until.getTime() > Date.now()) {
        return lockedResponse(failedAttempt.locked_until);
      }
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    await clearFailedLogins(username, clientKey);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, await createSessionToken(authenticatedUsername), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    });
    return response;
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? "Username and password are required."
        : error instanceof Error
          ? error.message
          : "Unable to sign in.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

