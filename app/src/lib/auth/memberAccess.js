export const hasActiveMemberAccess = (session) => {
  return Boolean(session?.email && session?.hasActiveSubscription === true && session?.subscriptionVerification !== "unavailable");
};

export const getMembershipDisplayState = (session) => {
  if (!session?.email) return "anonymous";
  if (hasActiveMemberAccess(session)) return "active";
  return session?.subscriptionVerification === "verified" ? "inactive" : "unavailable";
};
