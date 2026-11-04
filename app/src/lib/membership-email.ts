import {formatMembershipDate, membershipDates} from './membership-dates.ts';

export function renderMemberCodeEmail(template: string, recipient: {
  name: string; code: string; membershipStartDate: string; isFreeMembership?: boolean; language: string;
}, checkoutUrl: string) {
  const dates = membershipDates(recipient.membershipStartDate, recipient.isFreeMembership);
  const escape = (value: string) => value.replace(/[&<>"'{}]/g, (char) =>
    ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '{': '&#123;', '}': '&#125;'})[char]!);
  const values = {
    name: recipient.name, code: recipient.code, checkoutUrl,
    renewalDate: formatMembershipDate(dates.renewalDate, recipient.language),
    membershipStartDate: formatMembershipDate(dates.membershipStartDate, recipient.language),
  };
  const html = template.replace(/\{\{(name|code|checkoutUrl|renewalDate|membershipStartDate)\}\}/g, (_, key) => escape(values[key]));
  if (/\{\{(?:name|code|checkoutUrl|renewalDate|membershipStartDate)\}\}/.test(html)) throw new Error('Unresolved member email placeholder.');
  return html;
}
