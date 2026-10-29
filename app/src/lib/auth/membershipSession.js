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

  const adminSubscriptionStatus = await getCustomerSubscriptionStatus(resolvedSession?.shopifyCustomerId || null);
  // The login cookie identifies the customer; its membership snapshot can be stale.
  const subscriptionStatus = adminSubscriptionStatus;
  const hasSubscriptionMembership = subscriptionStatus?.hasActiveSubscription === true;

  return {
    ...resolvedSession,
    ...(subscriptionStatus && typeof subscriptionStatus === "object" ? subscriptionStatus : {}),
    isAuthenticated: true,
    hasActiveSubscription: hasSubscriptionMembership,
    subscriptionStartDate: hasSubscriptionMembership
      ? subscriptionStatus?.subscriptionStartDate || resolvedSession?.subscriptionStartDate || null
      : null,
  };
};

export const getMembershipSessionFromRequest = async (req) => {
  const session = decodeSessionToken(req?.cookies?.[SESSION_COOKIE_NAME]);
  return resolveMembershipSession(session);
};
