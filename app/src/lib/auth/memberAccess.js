export const hasActiveMemberAccess = (session) => {
  return Boolean(session?.email && session?.hasActiveSubscription === true && session?.subscriptionVerification !== "unavailable");
};

export const getMembershipDisplayState = (session) => {
  if (!session?.email) return "anonymous";
  if (hasActiveMemberAccess(session)) return "active";
  return session?.subscriptionVerification === "verified" ? "inactive" : "unavailable";
};

export const getMembershipDisplayStartDate = (session) => {
  const billingDate = session?.nextBillingDate ? new Date(session.nextBillingDate) : null;
  if (!billingDate || Number.isNaN(billingDate.getTime())) return session?.subscriptionStartDate || null;

  // Subtract a calendar year, clamping leap day to February 28.
  const month = billingDate.getUTCMonth();
  const day = billingDate.getUTCDate();
  billingDate.setUTCDate(1);
  billingDate.setUTCFullYear(billingDate.getUTCFullYear() - 1);
  const lastDay = new Date(Date.UTC(billingDate.getUTCFullYear(), month + 1, 0)).getUTCDate();
  billingDate.setUTCDate(Math.min(day, lastDay));
  return billingDate.toISOString();
};
