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
  const customerAccountSubscriptionStatus =
    resolvedSession?.subscriptionSource === "customer_account_api"
      ? {
          hasActiveSubscription: resolvedSession?.hasActiveSubscription === true,
          subscriptionStatus: resolvedSession?.subscriptionStatus || null,
          subscriptionName: resolvedSession?.subscriptionName || null,
          subscriptionStartDate: resolvedSession?.subscriptionStartDate || null,
          nextBillingDate: resolvedSession?.nextBillingDate || null,
          contractId: resolvedSession?.contractId || null,
          subscriptionLines: Array.isArray(resolvedSession?.subscriptionLines) ? resolvedSession.subscriptionLines : [],
          isMemberPlus: resolvedSession?.isMemberPlus === true,
          subscriptionSource: resolvedSession?.subscriptionSource,
          debug: resolvedSession?.subscriptionDebug || null,
        }
      : null;
  const subscriptionStatus =
    customerAccountSubscriptionStatus?.contractId || customerAccountSubscriptionStatus?.subscriptionStartDate
      ? customerAccountSubscriptionStatus
      : adminSubscriptionStatus;

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
