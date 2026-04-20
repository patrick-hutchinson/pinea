export const hasActiveMemberAccess = (session) => {
  if (!session?.email) return false;

  if (
    session?.hasActiveSubscription === true ||
    session?.isMember === true ||
    session?.isMemberPlus === true ||
    session?.membershipActive === true ||
    session?.subscriptionActive === true ||
    session?.subscriptionStatus === "active"
  ) {
    return true;
  }

  // Current auth flow only signs in customer accounts, which map to member access.
  return true;
};

