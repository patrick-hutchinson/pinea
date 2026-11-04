import {createHash} from 'node:crypto';
import {createMembershipRedemptionLink, isMembershipCouponCode} from '../membership-redemption.ts';

export type DiscountDocument = {
  _id: string; _rev: string; _type: string; title: string; recipientEmail: string; recipientName?: string;
  couponCode: string; membershipTier: string; region?: string; language: string; subject: string;
  syncStatus?: string; syncFingerprint?: string; syncLeaseToken?: string; syncLeaseUntil?: string;
};

const variants: Record<string, Record<string, string>> = {
  member: {AT: '63963156873565', EU: '63971059597661', WORLD: '63971059630429'},
  student: {AT: '63971055567197', EU: '63971055599965'},
  plus: {DEFAULT: '63963164475741'},
};
export const privateMembershipId = (id: string) => /^membershipDiscount\.[a-zA-Z0-9_-]+$/.test(id);
const escape = (value: string) => value.replace(/[&<>"']/g, (char) =>
  ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[char]!)
  .replaceAll('{{', '&#123;&#123;').replaceAll('}}', '&#125;&#125;');

export function renderMembershipDiscount(doc: DiscountDocument, template: string, baseUrl: string, secret: string) {
  if (!privateMembershipId(doc._id) || doc._type !== 'membershipDiscountNewsletter') throw new Error('Invalid private membership document');
  const email = String(doc.recipientEmail || '').trim().toLowerCase();
  const code = String(doc.couponCode || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Bitte eine gueltige E-Mail-Adresse eintragen.');
  if (!isMembershipCouponCode(code)) throw new Error('Bitte einen gueltigen Shopify Rabattcode eintragen.');
  if (!['de', 'en'].includes(doc.language)) throw new Error('Bitte eine Sprache auswaehlen.');
  if (!doc.title?.trim() || !doc.subject?.trim()) throw new Error('Titel und Betreff fehlen.');
  const variant = variants[doc.membershipTier]?.[doc.membershipTier === 'plus' ? 'DEFAULT' : doc.region || ''];
  if (!variant) throw new Error('Diese Kombination aus Membership und Region ist nicht verfuegbar.');
  const base = new URL(baseUrl);
  if (base.protocol !== 'https:' && base.hostname !== 'localhost') throw new Error('Membership URL muss HTTPS verwenden.');
  const checkoutUrl = createMembershipRedemptionLink(base.origin, {
    email, code, variantId: `gid://shopify/ProductVariant/${variant}`, sellingPlanId: 'gid://shopify/SellingPlan/690977046877',
  }, secret);
  for (const marker of ['{{code}}', '{{checkoutUrl}}']) {
    if (!template.includes(marker)) throw new Error('Die E-Mail-Vorlage enthaelt nicht alle Platzhalter.');
  }
  const name = doc.recipientName?.trim() || 'P.IN.E.A Member';
  const values = {name: escape(name), code: escape(code), checkoutUrl: escape(checkoutUrl)};
  const html = template.replace(/\{\{(name|code|checkoutUrl)\}\}/g, (_, key) => values[key])
    // Future manually issued coupons must not inherit the original migration batch's fixed date.
    .replace('Abgebucht wird erst ab 01.01.2027.', 'Den Termin der ersten kostenpflichtigen Verlaengerung siehst du im Checkout.')
    .replace('You will not be charged before January 1, 2027.', 'The date of your first paid renewal is shown at checkout.');
  const fingerprint = createHash('sha256').update(JSON.stringify({
    title: doc.title.trim(), subject: doc.subject.trim(), email, name, code, checkoutUrl, html,
  })).digest('hex');
  return {email, name, code, checkoutUrl, html, fingerprint, subject: doc.subject.trim(),
    stableName: `Membership Rabattcode ${doc._id}`, listName: `Membership Einzelversand ${doc._id}`};
}
