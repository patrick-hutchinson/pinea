import { isAuthEnabled } from "@/lib/runtimeFlags";
import { decodeSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/sessionCore";
import {resolveCustomerMembership} from './customerMembership.js';
import {CUSTOMER_TOKENS_COOKIE_NAME, CUSTOMER_TOKENS_COOKIE_OPTIONS, decodeCustomerTokens, encodeCustomerTokens} from './customerTokens.js';
import {getAbsoluteRequestUrl, parseCookies, setResponseCookie} from '@/lib/pages/api';

export const resolveMembershipSession = async (session, options = {}) => {
  if (!isAuthEnabled) {
    return {
      isAuthenticated: false,
      hasActiveSubscription: false,
    };
  }

  const resolvedSession = session?.email ? session : null;

  if (!resolvedSession?.email) {
    return {
      isAuthenticated: false,
      hasActiveSubscription: false,
    };
  }

  return resolveCustomerMembership({session: resolvedSession, ...options});
};

export const getMembershipSessionFromRequest = async (req, res) => {
  const cookies = req?.cookies || parseCookies(req?.headers?.cookie || '');
  const session = decodeSessionToken(cookies[SESSION_COOKIE_NAME]);
  const credentials = decodeCustomerTokens(cookies[CUSTOMER_TOKENS_COOKIE_NAME]);
  if (res && session?.email) {
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    const vary = res.getHeader('Vary');
    res.setHeader('Vary', vary ? `${vary}, Cookie` : 'Cookie');
  }
  return resolveMembershipSession(session, {credentials, origin: getAbsoluteRequestUrl(req).origin,
    onTokensUpdated: res ? (tokens) => setResponseCookie(res, CUSTOMER_TOKENS_COOKIE_NAME, encodeCustomerTokens(tokens), CUSTOMER_TOKENS_COOKIE_OPTIONS) : null});
};
