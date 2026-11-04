import assert from "node:assert/strict";
import test from "node:test";
import { hasActiveMemberAccess, getMembershipDisplayState, getMembershipDisplayStartDate } from "./memberAccess.js";
import { getCustomerSubscriptionStatus, getCustomerSubscriptionStatusByEmail } from "../shopifySubscriptions.js";

test('profile date uses next billing minus one calendar year, without changing contract dates', () => {
  const session = {subscriptionStartDate: '2026-11-04T00:00:00Z', nextBillingDate: '2027-07-14T12:30:00Z'};
  assert.equal(getMembershipDisplayStartDate(session), '2026-07-14T12:30:00.000Z');
  assert.equal(session.subscriptionStartDate, '2026-11-04T00:00:00Z');
  assert.equal(session.nextBillingDate, '2027-07-14T12:30:00Z');
  assert.equal(getMembershipDisplayStartDate({nextBillingDate: '2028-02-29T00:00:00Z'}), '2027-02-28T00:00:00.000Z');
  for (const nextBillingDate of [null, undefined, '', 'invalid']) {
    assert.equal(getMembershipDisplayStartDate({...session, nextBillingDate}), session.subscriptionStartDate);
  }
  assert.equal(getMembershipDisplayStartDate(null), null);
});

test("logging in alone or having a tier does not grant member access", () => {
  for (const session of [null, {}, { email: "reader@example.com" },
    { email: "reader@example.com", subscriptionStatus: "active" },
    { email: "reader@example.com", isMemberPlus: true },
    { email: "reader@example.com", hasActiveSubscription: false, isMember: true }]) {
    assert.equal(hasActiveMemberAccess(session), false);
  }
  assert.equal(hasActiveMemberAccess({ email: "member@example.com", hasActiveSubscription: true }), true);
  assert.equal(hasActiveMemberAccess({ hasActiveSubscription: true }), false);
});

test('an inaccessible contract lookup is not displayed as a verified non-membership', () => {
  assert.equal(getMembershipDisplayState({email: 'member@example.com', hasActiveSubscription: false,
    subscriptionVerification: 'unavailable'}), 'unavailable');
  assert.equal(getMembershipDisplayState({email: 'member@example.com', hasActiveSubscription: false,
    subscriptionVerification: 'verified'}), 'inactive');
  assert.equal(getMembershipDisplayState({email: 'member@example.com', hasActiveSubscription: true,
    subscriptionVerification: 'verified'}), 'active');
  assert.equal(getMembershipDisplayState({email: 'member@example.com', hasActiveSubscription: true,
    subscriptionVerification: 'unavailable'}), 'unavailable');
  assert.equal(getMembershipDisplayState(null), 'anonymous');
});

test("only live ACTIVE contracts grant access, regardless of legacy tags or metafields", async () => {
  const originalFetch = globalThis.fetch;
  const originalDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const originalToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  process.env.SHOPIFY_STORE_DOMAIN = "test.myshopify.com";
  process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN = "test-token";
  let contracts = [];
  const legacyCustomer = () => ({
    id: "gid://shopify/Customer/123",
    tags: ["subscription:active", "subscription_tier:Member Plus"],
    subscriptionStatusMetafield: { value: 'active' },
    subscriptionTierMetafield: { value: 'Member Plus' },
    subscriptionStartDateMetafield: { value: '2020-01-01' },
    subscriptionContracts: { nodes: contracts },
  });
  globalThis.fetch = async (_url, options) => {
    const {query} = JSON.parse(options.body);
    assert.ok(!query.includes('metafield('));
    return Response.json({data: query.includes('CustomerSubscriptionsByEmail')
      ? {customers: {nodes: [legacyCustomer()]}} : {customer: legacyCustomer()}});
  };
  try {
    for (const lookup of [() => getCustomerSubscriptionStatus('gid://shopify/Customer/123'),
      () => getCustomerSubscriptionStatusByEmail('reader@example.com')]) {
      contracts = [];
      const empty = await lookup();
      assert.equal(empty.hasActiveSubscription, false);
      assert.equal(empty.debug.reason, 'no_visible_contract');
      assert.equal(empty.subscriptionVerification, 'unavailable');
      assert.equal(empty.isMemberPlus, false);
      for (const status of ['PAUSED', 'CANCELLED', 'EXPIRED', 'FAILED']) {
        contracts = [{id: 'gid://shopify/SubscriptionContract/1', status}];
        const inactive = await lookup();
        assert.equal(inactive.hasActiveSubscription, false);
        assert.equal(inactive.subscriptionVerification, 'verified');
      }
      contracts = [{id: 'gid://shopify/SubscriptionContract/1', status: 'ACTIVE',
        createdAt: '2026-11-01T12:00:00Z', nextBillingDate: '2027-11-01T12:00:00Z',
        lines: {nodes: [{title: 'P.IN.E.A Member', sellingPlanName: 'Yearly'}]}}];
      const active = await lookup();
      assert.equal(active.hasActiveSubscription, true);
      assert.equal(active.subscriptionVerification, 'verified');
      assert.equal(active.subscriptionName, 'P.IN.E.A Member');
      assert.equal(active.isMemberPlus, false);
      assert.equal(active.subscriptionStartDate, '2026-11-01T12:00:00Z');
      assert.equal(active.nextBillingDate, '2027-11-01T12:00:00Z');
      contracts[0].lines.nodes[0].title = 'P.IN.E.A Member Plus';
      assert.equal((await lookup()).isMemberPlus, true);
      contracts[0].status = 'CANCELLED';
      const cancelled = await lookup();
      assert.equal(cancelled.hasActiveSubscription, false);
      assert.equal(cancelled.contractId, null);
      assert.equal(cancelled.subscriptionName, null);
      assert.equal(cancelled.subscriptionStartDate, null);
    }
    globalThis.fetch = async () => Response.json({errors: [{message: 'Access denied'}]}, {status: 403});
    const denied = await getCustomerSubscriptionStatus('gid://shopify/Customer/123');
    assert.equal(denied.hasActiveSubscription, false);
    assert.equal(denied.subscriptionVerification, 'unavailable');
  } finally {
    globalThis.fetch = originalFetch;
    if (originalDomain === undefined) delete process.env.SHOPIFY_STORE_DOMAIN;
    else process.env.SHOPIFY_STORE_DOMAIN = originalDomain;
    if (originalToken === undefined) delete process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    else process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN = originalToken;
  }
});
