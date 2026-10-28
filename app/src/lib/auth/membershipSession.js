import { isAuthEnabled } from "@/lib/runtimeFlags";
import { decodeSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/sessionCore";
import { getCustomerSubscriptionStatus } from "@/lib/shopifySubscriptions";
import { getActiveGiftEntitlementForCustomer } from "@/lib/membershipGifts";

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

  const [adminSubscriptionStatus, giftEntitlement] = await Promise.all([
    getCustomerSubscriptionStatus(resolvedSession?.shopifyCustomerId || null),
    getActiveGiftEntitlementForCustomer(resolvedSession?.shopifyCustomerId || null),
  ]);
  // The login cookie identifies the customer; its membership snapshot can be stale.
  const subscriptionStatus = adminSubscriptionStatus;
  const hasGiftMembership = Boolean(giftEntitlement?._id);
  const hasSubscriptionMembership = subscriptionStatus?.hasActiveSubscription === true;

  return {
    ...resolvedSession,
    ...(subscriptionStatus && typeof subscriptionStatus === "object" ? subscriptionStatus : {}),
    isAuthenticated: true,
    hasActiveSubscription: hasSubscriptionMembership || hasGiftMembership,
    subscriptionStartDate: hasSubscriptionMembership
      ? subscriptionStatus?.subscriptionStartDate || resolvedSession?.subscriptionStartDate || null
      : null,
    giftMembership: giftEntitlement
      ? {
          id: giftEntitlement._id,
          tier: giftEntitlement.tier || null,
          startsAt: giftEntitlement.startsAt || null,
          endsAt: giftEntitlement.endsAt || null,
          source: "gift",
        }
      : null,
  };
};

export const getMembershipSessionFromRequest = async (req) => {
  const session = decodeSessionToken(req?.cookies?.[SESSION_COOKIE_NAME]);
  return resolveMembershipSession(session);
};
