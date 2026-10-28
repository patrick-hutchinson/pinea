export const hasActiveMemberAccess = (session) => {
  return Boolean(session?.email && session?.hasActiveSubscription === true);
};

export const hasActiveMembershipMetafields = (status, tier) =>
  typeof status === "string" &&
  status.trim().toLowerCase() === "active" &&
  typeof tier === "string" &&
  tier.trim().length > 0;
