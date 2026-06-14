export const SESSION_COOKIE_NAME = "crm_session";
export const SESSION_DURATION_SECONDS = 8 * 60 * 60;

type SessionPayload = {
  username: string;
  expiresAt: number;
};

function encodeBase64Url(value: string) {
  return btoa(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  return atob(value.replace(/-/g, "+").replace(/_/g, "/") + padding);
}

function bytesToBase64Url(bytes: Uint8Array) {
  let value = "";
  for (const byte of bytes) value += String.fromCharCode(byte);
  return encodeBase64Url(value);
}

async function signingKey() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SESSION_SECRET must be at least 32 characters.");
  }

  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signatureFor(payload: string) {
  const signature = await crypto.subtle.sign(
    "HMAC",
    await signingKey(),
    new TextEncoder().encode(payload),
  );
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(username: string) {
  const payload: SessionPayload = {
    username,
    expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${await signatureFor(encodedPayload)}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return null;

  try {
    const [encodedPayload, suppliedSignature, extra] = token.split(".");
    if (!encodedPayload || !suppliedSignature || extra) return null;

    const expectedSignature = await signatureFor(encodedPayload);
    if (suppliedSignature !== expectedSignature) return null;

    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as SessionPayload;
    if (!payload.username || payload.expiresAt <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

