import {formatMembershipDate, membershipDates} from './membership-dates.ts';

export function renderMemberCodeEmail(template: string, recipient: {
  name: string; code: string; membershipStartDate?: string; isFreeMembership?: boolean; language: string;
}, checkoutUrl: string) {
  const dates = recipient.membershipStartDate ? membershipDates(recipient.membershipStartDate, recipient.isFreeMembership) : null;
  const english = recipient.language.toLowerCase().split('-')[0] === 'en';
  const billingNotice = dates
    ? english ? `You will not be charged before ${formatMembershipDate(dates.renewalDate, recipient.language)}.`
      : `Abgebucht wird erst ab ${formatMembershipDate(dates.renewalDate, recipient.language)}.`
    : recipient.isFreeMembership
      ? english ? 'Your FREE membership has a subscription period of three years.'
        : 'Aufgrund deiner FREE-Membership beträgt deine Abonnementlaufzeit drei Jahre.'
      : english ? 'You will only be charged once your first year of membership has ended.'
        : 'Abgebucht wird erst, wenn dein erstes Jahr der Membership abgelaufen ist.';
  const escape = (value: string) => value.replace(/[&<>"'{}]/g, (char) =>
    ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '{': '&#123;', '}': '&#125;'})[char]!);
  const values = {
    name: recipient.name, code: recipient.code, checkoutUrl,
    billingNotice,
    renewalDate: dates ? formatMembershipDate(dates.renewalDate, recipient.language) : '',
    membershipStartDate: dates ? formatMembershipDate(dates.membershipStartDate, recipient.language) : '',
  };
  if (!dates && !template.includes('{{billingNotice}}')) throw new Error('Date-free emails require the billingNotice placeholder.');
  const html = template.replace(/\{\{(name|code|checkoutUrl|renewalDate|membershipStartDate|billingNotice)\}\}/g, (_, key) => escape(values[key]));
  if (/\{\{(?:name|code|checkoutUrl|renewalDate|membershipStartDate|billingNotice)\}\}/.test(html)) throw new Error('Unresolved member email placeholder.');
  return html;
}
