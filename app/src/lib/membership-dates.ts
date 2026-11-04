const DAY = 86_400_000;

export function parseMembershipDate(value: unknown): Date {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Membership start date must be YYYY-MM-DD.');
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new Error('Invalid membership start date.');
  return date;
}

export function membershipDates(startDate: string, isFreeMembership = false) {
  const start = parseMembershipDate(startDate);
  let renewal = new Date(start.getTime() + 365 * DAY);
  if (isFreeMembership) {
    const year = start.getUTCFullYear() + 3;
    const month = start.getUTCMonth();
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    // Preserve the anniversary; February 29 becomes February 28 in a non-leap year.
    renewal = new Date(Date.UTC(year, month, Math.min(start.getUTCDate(), lastDay)));
  }
  const membershipTermDays = (renewal.getTime() - start.getTime()) / DAY;
  const renewalDate = renewal.toISOString().slice(0, 10);
  return {membershipStartDate: startDate, membershipTermDays, renewalDate};
}

export function formatMembershipDate(value: string, language: string) {
  const date = parseMembershipDate(value);
  return new Intl.DateTimeFormat(language.toLowerCase() === 'en' ? 'en-GB' : 'de-AT', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}

export function requireFutureRenewal(value: string, now = new Date()) {
  parseMembershipDate(value);
  const today = new Intl.DateTimeFormat('en-CA', {timeZone: 'Europe/Vienna', year: 'numeric', month: '2-digit', day: '2-digit'}).format(now);
  if (value <= today) throw new Error('Membership renewal date has already been reached. Review this member instead of issuing a free migration checkout.');
}

export function verifyMembershipDates(value: {membershipStartDate?: string; membershipTermDays?: number; renewalDate?: string}) {
  const any = value.membershipStartDate !== undefined || value.membershipTermDays !== undefined || value.renewalDate !== undefined;
  if (!any) return true; // Existing signed links remain verifiable; redemption handles migration safety separately.
  if (![365, 1095, 1096].includes(value.membershipTermDays || 0)) return false;
  try {
    const expected = membershipDates(value.membershipStartDate!, value.membershipTermDays !== 365);
    return expected.renewalDate === value.renewalDate && expected.membershipTermDays === value.membershipTermDays;
  } catch { return false; }
}
