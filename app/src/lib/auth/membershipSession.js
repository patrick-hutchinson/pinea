import { isAuthEnabled } from "@/lib/runtimeFlags";
import { getSessionFromCookies } from "@/lib/auth/session";
import { getCustomerSubscriptionStatus } from "@/lib/shopifySubscriptions";

export const getMembershipSession = async () => {
  if (!isAuthEnabled) {
    return {
      isAuthenticated: false,
      hasActiveSubscription: false,
    };
  }

  const session = await getSessionFromCookies();
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
