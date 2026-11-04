import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from 'csv-parse/sync';
import {membershipDates, formatMembershipDate, requireFutureRenewal, verifyMembershipDates} from './membership-dates.ts';
import {createMembershipRedemptionLink, verifyMembershipRedemptionToken} from './membership-redemption.ts';
import {renderMemberCodeEmail} from './membership-email.ts';
import {createMembershipCheckout} from './membership-checkout.ts';

test('normal memberships use exactly 365 days, including leap years and DST boundaries', () => {
  for (const [start, end] of [['2026-05-20', '2027-05-20'], ['2027-05-20', '2028-05-19'],
    ['2024-02-29', '2025-02-28'], ['2026-10-25', '2027-10-25']]) {
    assert.equal(membershipDates(start).renewalDate, end);
  }
});
test('FREE memberships use three calendar years from their original start', () => {
  assert.deepEqual(membershipDates('2026-05-20', true), {
    membershipStartDate: '2026-05-20', membershipTermDays: 1096, renewalDate: '2029-05-20',
  });
  assert.equal(membershipDates('2024-02-29', true).renewalDate, '2027-02-28');
  assert.equal(membershipDates('2025-01-01', true).renewalDate, '2028-01-01');
  assert.equal(membershipDates('2025-01-01', true).membershipTermDays, 1095);
  assert.equal(verifyMembershipDates(membershipDates('2026-05-20', true)), true);
  assert.equal(verifyMembershipDates(membershipDates('2025-01-01', true)), true);
  assert.equal(verifyMembershipDates({membershipStartDate: '2026-05-20', membershipTermDays: 1095, renewalDate: '2029-05-19'}), false);
});
test('invalid, missing and already reached dates fail closed', () => {
  for (const date of ['', '2026-02-30', '20.05.2026', '2026-13-01']) assert.throws(() => membershipDates(date));
  assert.throws(() => requireFutureRenewal('2026-11-04', new Date('2026-11-04T10:00:00Z')));
  assert.throws(() => requireFutureRenewal('2026-11-04', new Date('2026-11-03T23:30:00Z')));
  assert.doesNotThrow(() => requireFutureRenewal('2026-11-05', new Date('2026-11-04T10:00:00Z')));
  assert.equal(verifyMembershipDates({membershipStartDate: '2026-05-20', membershipTermDays: 365, renewalDate: '2030-01-01'}), false);
});
test('signed links preserve dates and reject altered dates', () => {
  const value = {email: 'member@example.com', code: 'TEST', variantId: 'gid://shopify/ProductVariant/1', sellingPlanId: 'gid://shopify/SellingPlan/2', ...membershipDates('2026-05-20')};
  const link = createMembershipRedemptionLink('https://example.com', value, 'secret');
  const token = new URL(link).searchParams.get('token')!;
  assert.deepEqual(verifyMembershipRedemptionToken(token, 'secret'), value);
  const [payload, signature] = token.split('.');
  const altered = {...JSON.parse(Buffer.from(payload, 'base64url').toString()), renewalDate: '2030-01-01'};
  assert.equal(verifyMembershipRedemptionToken(`${Buffer.from(JSON.stringify(altered)).toString('base64url')}.${signature}`, 'secret'), null);
});
test('dates render in each language and user content stays escaped', () => {
  assert.equal(formatMembershipDate('2027-05-20', 'DE'), '20.05.2027');
  assert.equal(formatMembershipDate('2027-05-20', 'EN'), '20/05/2027');
  assert.equal(renderMemberCodeEmail('{{name}} {{renewalDate}}', {name: '<Hi>{{code}}', code: 'TEST',
    membershipStartDate: '2026-05-20', isFreeMembership: true, language: 'de'}, 'https://example.com'), '&lt;Hi&gt;&#123;&#123;code&#125;&#125; 20.05.2029');
});
test('reconciled CSV dates are consistent and unmatched recipients remain blocked', () => {
  const rows: Record<string, string>[] = parse(readFileSync(new URL('../app/scripts/send-codes/member-discounts.csv', import.meta.url)), {columns: true});
  assert.equal(rows.length, 51);
  assert.equal(rows.filter((row) => row.date_match_status === 'matched').length, 49);
  const manuallyConfirmed = rows.filter((row) => row.date_match_status === 'manual_confirmed');
  assert.equal(manuallyConfirmed.length, 1);
  assert.equal(manuallyConfirmed[0].email, 'ph@studio-es.at');
  assert.equal(manuallyConfirmed[0].membership_start_date, '2026-07-18');
  assert.equal(manuallyConfirmed[0].renewal_date, '2027-07-18');
  for (const row of rows) {
    if (!['matched', 'manual_confirmed'].includes(row.date_match_status)) { assert.equal(row.membership_start_date, ''); assert.equal(row.renewal_date, ''); continue; }
    const dates = membershipDates(row.membership_start_date, row.is_free_membership === 'true');
    assert.equal(row.renewal_date, dates.renewalDate);
    assert.equal(row.membership_term_days, String(dates.membershipTermDays));
  }
  const source: Record<string, string>[] = parse(readFileSync(new URL('../app/scripts/send-codes/membership-start-dates.csv', import.meta.url)), {columns: true});
  assert.equal(source.filter((row) => row.is_free_membership === 'true').length, 6);
  assert.equal(source.filter((row) => row.is_free_membership === 'true' && !row.membership_start_date).length, 4);
});
test('checkout carries review metadata without pretending to update a contract', async (context) => {
  const previous = [process.env.SHOPIFY_STORE_DOMAIN, process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN];
  process.env.SHOPIFY_STORE_DOMAIN = 'test.myshopify.com'; process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = 'test';
  context.after(() => {
    for (const [i, key] of ['SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN'].entries()) {
      if (previous[i] === undefined) delete process.env[key]; else process.env[key] = previous[i];
    }
  });
  const redemption = {email: 'member@example.com', code: 'TEST', variantId: 'gid://shopify/ProductVariant/1', sellingPlanId: 'gid://shopify/SellingPlan/2', ...membershipDates('2030-05-20')};
  context.mock.method(globalThis, 'fetch', async (_url, options) => {
    const {variables, query} = JSON.parse(String(options?.body));
    assert.ok(query.includes('cartCreate'));
    assert.equal(variables.input.attributes.find((item) => item.key === 'Membership first paid renewal').value, '2031-05-20');
    assert.equal(variables.input.attributes.find((item) => item.key === 'Membership billing alignment').value, 'MANUAL_SHOPIFY_REVIEW_REQUIRED');
    return Response.json({data: {cartCreate: {userErrors: [], cart: {checkoutUrl: 'https://test.myshopify.com/checkouts/test', discountCodes: [{code: 'TEST', applicable: true}],
      lines: {nodes: [{sellingPlanAllocation: {sellingPlan: {id: redemption.sellingPlanId}}}]}}}}});
  });
  assert.equal(await createMembershipCheckout(redemption), 'https://test.myshopify.com/checkouts/test');
});
