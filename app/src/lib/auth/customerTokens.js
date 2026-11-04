import {createCipheriv, createDecipheriv, createHash, randomBytes} from 'node:crypto';

export const CUSTOMER_TOKENS_COOKIE_NAME = 'pinea_customer_tokens';
export const CUSTOMER_TOKENS_COOKIE_OPTIONS = {
  httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
};
const key = () => {
  const secret = process.env.AUTH_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('Missing AUTH_SESSION_SECRET');
  return createHash('sha256').update(`pinea/customer-tokens/v1:${secret}`).digest();
};

export function customerTokensFromResponse(response, customerId, clientId, previous = {}, now = Date.now()) {
  const expiresIn = Number(response?.expires_in);
  if (typeof response?.access_token !== 'string' || !response.access_token || !Number.isFinite(expiresIn) || expiresIn <= 0) {
    throw new Error('Shopify returned an invalid customer token response');
  }
  return {customerId, clientId, accessToken: response.access_token,
    refreshToken: response.refresh_token || previous.refreshToken || null,
    expiresAt: now + expiresIn * 1000, scopes: response.scope || previous.scopes || null,
    sessionExpiresAt: previous.sessionExpiresAt || now + CUSTOMER_TOKENS_COOKIE_OPTIONS.maxAge * 1000};
}

export function encodeCustomerTokens(tokens) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  cipher.setAAD(Buffer.from(CUSTOMER_TOKENS_COOKIE_NAME));
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(tokens), 'utf8'), cipher.final()]);
  const value = ['v1', iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), encrypted.toString('base64url')].join('.');
  if (value.length > 3800) throw new Error('Customer token cookie is too large');
  return value;
}

export function decodeCustomerTokens(value, now = Date.now()) {
  if (typeof value !== 'string' || value.length > 3800) return null;
  const [version, iv, tag, data, extra] = value.split('.');
  if (version !== 'v1' || !iv || !tag || !data || extra) return null;
  try {
    const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64url'));
    decipher.setAAD(Buffer.from(CUSTOMER_TOKENS_COOKIE_NAME));
    decipher.setAuthTag(Buffer.from(tag, 'base64url'));
    const tokens = JSON.parse(Buffer.concat([decipher.update(Buffer.from(data, 'base64url')), decipher.final()]).toString('utf8'));
    if (!/^gid:\/\/shopify\/Customer\/\d+$/.test(tokens.customerId || '') || typeof tokens.clientId !== 'string' ||
      typeof tokens.accessToken !== 'string' || !tokens.accessToken || !Number.isFinite(tokens.expiresAt) ||
      !Number.isFinite(tokens.sessionExpiresAt) || tokens.sessionExpiresAt <= now) return null;
    return tokens;
  } catch { return null; }
}
