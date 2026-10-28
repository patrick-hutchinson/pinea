import assert from "node:assert/strict";
import test from "node:test";
import { syncGiftMembershipToShopifyCustomer } from "./shopifySubscriptions.js";

const entitlement = {
  tier: "Member Plus", startsAt: "2026-01-01T00:00:00Z", endsAt: "2027-01-01T00:00:00Z",
  sourceGiftId: "gift-1", createdFromOrderId: "order-1",
};
const customerId = "gid://shopify/Customer/123";
const fields = {
  gift_membership_status: { value: "active" },
  gift_membership_tier: { value: entitlement.tier },
  gift_membership_starts_at: { value: entitlement.startsAt },
  gift_membership_ends_at: { value: entitlement.endsAt },
  gift_membership_source_gift_id: { value: entitlement.sourceGiftId },
  gift_membership_source_order_id: { value: entitlement.createdFromOrderId },
};

const withShopify = async (customer, verify, failField = null) => {
  const originalFetch = globalThis.fetch;
  const originalDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const originalToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  process.env.SHOPIFY_STORE_DOMAIN = "test.myshopify.com";
  process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN = "test-token";
  const calls = [];
  globalThis.fetch = async (_url, options) => {
    const request = JSON.parse(options.body);
    calls.push(request);
    if (request.query.includes("query GiftCustomer")) return Response.json({ data: { customer } });
    const field = ["metafieldsSet", "metafieldsDelete", "tagsRemove", "tagsAdd"].find((name) => request.query.includes(name));
    return Response.json({ data: { [field]: { node: { id: customerId }, userErrors: field === failField ? [{ message: "Temporary failure" }] : [] } } });
  };
  try {
    await verify(calls);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalDomain === undefined) delete process.env.SHOPIFY_STORE_DOMAIN;
    else process.env.SHOPIFY_STORE_DOMAIN = originalDomain;
    if (originalToken === undefined) delete process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    else process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN = originalToken;
  }
};

test("expiry only clears gift metafields and tags", async () => {
  await withShopify({ id: customerId, ...fields, tags: ["subscription:active", "gift-membership-active", "gift-membership-tier:member_plus"] }, async (calls) => {
    await syncGiftMembershipToShopifyCustomer({ shopifyCustomerId: customerId });
    assert.deepEqual(calls[1].variables.metafields.map(({ key, value }) => [key, value]), [["gift_membership_status", "inactive"]]);
    assert.ok(calls[2].variables.metafields.every(({ key }) => key.startsWith("gift_membership_") && key !== "gift_membership_status"));
    assert.deepEqual(calls[3].variables.tags, ["gift-membership-active", "gift-membership-tier:member_plus"]);
    assert.equal(calls.length, 4);
  });
});

test("a fully synchronized gift requires no mutations", async () => {
  await withShopify({ id: customerId, ...fields, tags: ["gift-membership-active", "gift-membership-tier:member_plus"] }, async (calls) => {
    await syncGiftMembershipToShopifyCustomer({ shopifyCustomerId: customerId, entitlement });
    assert.equal(calls.length, 1);
  });
});

test("old gift tier tags are replaced without replacing unrelated tags", async () => {
  await withShopify({ id: customerId, ...fields, tags: ["newsletter", "subscription:active", "gift-membership-active", "gift-membership-tier:student"] }, async (calls) => {
    await syncGiftMembershipToShopifyCustomer({ shopifyCustomerId: customerId, entitlement });
    assert.deepEqual(calls[1].variables.tags, ["gift-membership-tier:student"]);
    assert.deepEqual(calls[2].variables.tags, ["gift-membership-tier:member_plus"]);
  });
});

test("Shopify mutation errors propagate so maintenance records a retryable failure", async () => {
  await withShopify({ id: customerId, tags: [] }, async () => {
    await assert.rejects(syncGiftMembershipToShopifyCustomer({ shopifyCustomerId: customerId, entitlement }), /Temporary failure/);
  }, "metafieldsSet");
});
