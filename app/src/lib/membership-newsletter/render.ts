import {createHash} from 'node:crypto';
import {createMembershipRedemptionLink, isMembershipCouponCode} from '../membership-redemption.ts';
import {membershipDates} from '../membership-dates.ts';
import {renderMemberCodeEmail} from '../membership-email.ts';

export type DiscountDocument = {
  _id: string; _rev: string; _type: string; title: string; recipientEmail: string; recipientName?: string;
  couponCode: string; membershipTier: string; region?: string; language: string; subject: string;
  membershipStartDate?: string; isFreeMembership?: boolean; billingAlignmentConfirmed?: boolean;
  syncStatus?: string; syncFingerprint?: string; syncLeaseToken?: string; syncLeaseUntil?: string;
};

const variants: Record<string, Record<string, string>> = {
  member: {AT: '63963156873565', EU: '63971059597661', WORLD: '63971059630429'},
  student: {AT: '63971055567197', EU: '63971055599965'},
  plus: {DEFAULT: '63963164475741'},
};
export const privateMembershipId = (id: string) => /^membershipDiscount\.[a-zA-Z0-9_-]+$/.test(id);

export function renderMembershipDiscount(doc: DiscountDocument, template: string, baseUrl: string, secret: string) {
  if (!privateMembershipId(doc._id) || doc._type !== 'membershipDiscountNewsletter') throw new Error('Invalid private membership document');
  const email = String(doc.recipientEmail || '').trim().toLowerCase();
  const code = String(doc.couponCode || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Bitte eine gueltige E-Mail-Adresse eintragen.');
  if (!isMembershipCouponCode(code)) throw new Error('Bitte einen gueltigen Shopify Rabattcode eintragen.');
  if (!['de', 'en'].includes(doc.language)) throw new Error('Bitte eine Sprache auswaehlen.');
  if (!doc.title?.trim() || !doc.subject?.trim()) throw new Error('Titel und Betreff fehlen.');
  if (!doc.membershipStartDate) throw new Error('Membership-Beginndatum fehlt. Bitte Datum ergaenzen; es wird nicht aus dem Einloesetag abgeleitet.');
  const dates = membershipDates(doc.membershipStartDate, doc.isFreeMembership);
  const variant = variants[doc.membershipTier]?.[doc.membershipTier === 'plus' ? 'DEFAULT' : doc.region || ''];
  if (!variant) throw new Error('Diese Kombination aus Membership und Region ist nicht verfuegbar.');
  const base = new URL(baseUrl);
  if (base.protocol !== 'https:' && base.hostname !== 'localhost') throw new Error('Membership URL muss HTTPS verwenden.');
  const checkoutUrl = createMembershipRedemptionLink(base.origin, {
    email, code, variantId: `gid://shopify/ProductVariant/${variant}`, sellingPlanId: 'gid://shopify/SellingPlan/690977046877', ...dates,
  }, secret);
  for (const marker of ['{{code}}', '{{checkoutUrl}}', '{{renewalDate}}']) {
    if (!template.includes(marker)) throw new Error('Die E-Mail-Vorlage enthaelt nicht alle Platzhalter.');
  }
  const name = doc.recipientName?.trim() || 'P.IN.E.A Member';
  const html = renderMemberCodeEmail(template, {name, code, membershipStartDate: dates.membershipStartDate,
    isFreeMembership: doc.isFreeMembership, language: doc.language}, checkoutUrl);
  const fingerprint = createHash('sha256').update(JSON.stringify({
    title: doc.title.trim(), subject: doc.subject.trim(), email, name, code, checkoutUrl, html,
  })).digest('hex');
  return {email, name, code, checkoutUrl, html, fingerprint, ...dates, subject: doc.subject.trim(),
    stableName: `Membership Rabattcode ${doc._id}`, listName: `Membership Einzelversand ${doc._id}`};
}
