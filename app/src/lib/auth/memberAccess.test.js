import assert from "node:assert/strict";
import test from "node:test";
import { hasActiveMemberAccess } from "./memberAccess.js";
import { getCustomerSubscriptionStatus, getCustomerSubscriptionStatusByEmail } from "../shopifySubscriptions.js";

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
      assert.equal(empty.isMemberPlus, false);
      for (const status of ['PAUSED', 'CANCELLED', 'EXPIRED', 'FAILED']) {
        contracts = [{id: 'gid://shopify/SubscriptionContract/1', status}];
        assert.equal((await lookup()).hasActiveSubscription, false);
      }
      contracts = [{id: 'gid://shopify/SubscriptionContract/1', status: 'ACTIVE',
        createdAt: '2026-11-01T12:00:00Z', nextBillingDate: '2027-11-01T12:00:00Z',
        lines: {nodes: [{title: 'P.IN.E.A Member', sellingPlanName: 'Yearly'}]}}];
      const active = await lookup();
      assert.equal(active.hasActiveSubscription, true);
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
    assert.equal((await getCustomerSubscriptionStatus('gid://shopify/Customer/123')).hasActiveSubscription, false);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalDomain === undefined) delete process.env.SHOPIFY_STORE_DOMAIN;
    else process.env.SHOPIFY_STORE_DOMAIN = originalDomain;
    if (originalToken === undefined) delete process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    else process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN = originalToken;
  }
});
