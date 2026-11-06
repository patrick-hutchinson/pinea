export const hasActiveMemberAccess = (session, now = Date.now()) => {
  if (!session?.email || session?.hasActiveSubscription !== true || session?.subscriptionVerification === "unavailable") return false;
  if (session?.subscriptionStatus === 'CANCELLED') {
    const end = session.membershipAccessEndsAt ? Date.parse(session.membershipAccessEndsAt) : NaN;
    return Number.isFinite(end) && end > now;
  }
  if (session?.subscriptionStatus && session.subscriptionStatus !== 'ACTIVE') return false;
  return true;
};

export const getMembershipDisplayState = (session) => {
  if (!session?.email) return "anonymous";
  if (hasActiveMemberAccess(session)) return "active";
  return session?.subscriptionVerification === "verified" ? "inactive" : "unavailable";
};

export const getMembershipDisplayStartDate = (session) => {
  const rawBillingDate = session?.effectiveNextBillingDate || session?.nextBillingDate;
  const billingDate = rawBillingDate ? new Date(rawBillingDate) : null;
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
