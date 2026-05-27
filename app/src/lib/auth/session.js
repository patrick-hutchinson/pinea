import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "pinea_customer_session";
export const SHOPIFY_OAUTH_COOKIE_NAME = "pinea_shopify_oauth";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const OAUTH_MAX_AGE_SECONDS = 60 * 10;

const getSigningSecret = () => {
  const secret = process.env.AUTH_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_SESSION_SECRET (or NEXTAUTH_SECRET).");
  }
  return secret;
};

const base64UrlEncode = (value) => Buffer.from(value).toString("base64url");

const base64UrlDecode = (value) => Buffer.from(value, "base64url").toString("utf8");

const sign = (value, secret) => createHmac("sha256", secret).update(value).digest("base64url");

const encodeSignedPayload = (payload, ttlSeconds) => {
  const now = Math.floor(Date.now() / 1000);
  const body = JSON.stringify({ ...payload, iat: now, exp: now + ttlSeconds });
  const encoded = base64UrlEncode(body);
  const signature = sign(encoded, getSigningSecret());
  return `${encoded}.${signature}`;
};

const decodeSignedPayload = (token) => {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expectedSignature = sign(encoded, getSigningSecret());
  const given = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encoded));
    const now = Math.floor(Date.now() / 1000);
    if (!payload?.exp || payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
};

export const createSessionToken = (sessionUser) =>
  encodeSignedPayload(
    {
      sub: sessionUser?.id || null,
      email: sessionUser?.email || null,
      name: sessionUser?.name || "",
      shopifyCustomerId: sessionUser?.shopifyCustomerId || null,
    },
    SESSION_MAX_AGE_SECONDS,
  );

export const decodeSessionToken = (token) => decodeSignedPayload(token);

export const getSessionFromCookies = async () => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  return decodeSessionToken(token);
};

export const createOAuthStateToken = (payload) => encodeSignedPayload(payload, OAUTH_MAX_AGE_SECONDS);

export const decodeOAuthStateToken = (token) => decodeSignedPayload(token);

export const generateCodeVerifier = () => randomBytes(64).toString("base64url");

export const generateCodeChallenge = (codeVerifier) =>
  createHash("sha256").update(codeVerifier).digest("base64url");

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};

export const OAUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth/shopify",
  maxAge: OAUTH_MAX_AGE_SECONDS,
};
