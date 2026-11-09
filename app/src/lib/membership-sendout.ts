import {membershipDates, requireFutureRenewal} from './membership-dates.ts';

export function getSendoutDates(recipient: {
  membership_start_date?: string; renewal_date?: string; membership_term_days?: string;
  date_match_status?: string; is_free_membership?: string;
}) {
  if (!recipient.membership_start_date && !recipient.renewal_date && !recipient.membership_term_days &&
      ['missing_start_date', 'no_source_match'].includes(recipient.date_match_status || '')) {
    return undefined;
  }
  if (!['matched', 'manual_confirmed'].includes(recipient.date_match_status || '') || !recipient.membership_start_date) {
    throw new Error('Membership dates need review.');
  }
  if (!['true', 'false'].includes(recipient.is_free_membership || '')) throw new Error('Missing FREE status.');
  const dates = membershipDates(recipient.membership_start_date, recipient.is_free_membership === 'true');
  if (dates.renewalDate !== recipient.renewal_date || String(dates.membershipTermDays) !== recipient.membership_term_days) {
    throw new Error('Stored renewal date does not match the membership start date. Re-import dates.');
  }
  requireFutureRenewal(dates.renewalDate);
  return dates;
}
