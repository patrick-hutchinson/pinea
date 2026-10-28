import assert from "node:assert/strict";
import test from "node:test";
import { hasActiveMemberAccess, hasActiveMembershipMetafields } from "./memberAccess.js";
import { getCustomerSubscriptionStatus } from "../shopifySubscriptions.js";

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

test("Shopify selection fields require both active status and a populated tier", () => {
  assert.equal(hasActiveMembershipMetafields("active", "P.IN.E.A Member (Student)"), true);
  assert.equal(hasActiveMembershipMetafields(" ACTIVE ", " Member Plus "), true);
  for (const [status, tier] of [[null, "Member"], ["cancelled", "Member"], ["paused", "Member"],
    ["inactive", "Member Plus"], ["true", "Member"], ["active", null], ["active", " "]]) {
    assert.equal(hasActiveMembershipMetafields(status, tier), false);
  }
});

test("server lookup ignores stale tags and requires active membership metafields", async () => {
  const originalFetch = globalThis.fetch;
  const originalDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const originalToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  process.env.SHOPIFY_STORE_DOMAIN = "test.myshopify.com";
  process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN = "test-token";
  let status = "inactive";
  let tier = "Member Plus";
  globalThis.fetch = async () => Response.json({ data: { customer: {
    id: "gid://shopify/Customer/123",
    tags: ["subscription:active", "subscription_tier:Member Plus"],
    subscriptionStatusMetafield: { value: status },
    subscriptionTierMetafield: { value: tier },
    subscriptionContracts: { nodes: [] },
  } } });
  try {
    assert.equal((await getCustomerSubscriptionStatus("gid://shopify/Customer/123")).hasActiveSubscription, false);
    status = "active";
    assert.equal((await getCustomerSubscriptionStatus("gid://shopify/Customer/123")).hasActiveSubscription, true);
    tier = "";
    assert.equal((await getCustomerSubscriptionStatus("gid://shopify/Customer/123")).hasActiveSubscription, false);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalDomain === undefined) delete process.env.SHOPIFY_STORE_DOMAIN;
    else process.env.SHOPIFY_STORE_DOMAIN = originalDomain;
    if (originalToken === undefined) delete process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    else process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN = originalToken;
  }
});
