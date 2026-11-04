export const hasActiveMemberAccess = (session) => {
  return Boolean(session?.email && session?.hasActiveSubscription === true);
};
