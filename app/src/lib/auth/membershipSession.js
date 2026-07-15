import { isAuthEnabled } from "@/lib/runtimeFlags";
import { decodeSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/sessionCore";
import { getCustomerSubscriptionStatus } from "@/lib/shopifySubscriptions";

export const resolveMembershipSession = async (session) => {
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

  const subscriptionStatus = await getCustomerSubscriptionStatus(resolvedSession?.shopifyCustomerId || null);

  return {
    ...resolvedSession,
    ...(subscriptionStatus && typeof subscriptionStatus === "object" ? subscriptionStatus : {}),
    isAuthenticated: true,
    hasActiveSubscription: subscriptionStatus?.hasActiveSubscription === true,
  };
};

export const getMembershipSessionFromRequest = async (req) => {
  const session = decodeSessionToken(req?.cookies?.[SESSION_COOKIE_NAME]);
  return resolveMembershipSession(session);
};
