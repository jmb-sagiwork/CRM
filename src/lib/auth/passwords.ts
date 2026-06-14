import { pbkdf2Sync, timingSafeEqual } from "node:crypto";

type StoredUser = {
  salt: string;
  hash: string;
  iterations: number;
};

type StoredUsers = Record<string, StoredUser>;

const FALLBACK_USER: StoredUser = {
  salt: "00000000000000000000000000000000",
  hash: "0000000000000000000000000000000000000000000000000000000000000000",
  iterations: 210_000,
};

function configuredUsers() {
  const value = process.env.AUTH_USERS;
  if (!value) throw new Error("AUTH_USERS is not configured.");

  const decodedValue = value.startsWith("{")
    ? value
    : Buffer.from(value, "base64").toString("utf8");
  const users = JSON.parse(decodedValue) as StoredUsers;
  if (!users || typeof users !== "object") throw new Error("AUTH_USERS is invalid.");
  return users;
}

export async function verifyPassword(username: string, password: string) {
  const normalizedUsername = username.trim().toLowerCase();
  const user = configuredUsers()[normalizedUsername] || FALLBACK_USER;
  const suppliedHash = pbkdf2Sync(password, Buffer.from(user.salt, "hex"), user.iterations, 32, "sha256");
  const expectedHash = Buffer.from(user.hash, "hex");
  const valid = expectedHash.length === suppliedHash.length && timingSafeEqual(expectedHash, suppliedHash);

  return valid && user !== FALLBACK_USER ? normalizedUsername : null;
}
