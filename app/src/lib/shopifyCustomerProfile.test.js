import assert from "node:assert/strict";
import test from "node:test";
import { getCustomerProfile, updateCustomerProfile } from "./shopifyCustomerProfile.js";

const id = "gid://shopify/Customer/123";
const addressId = "gid://shopify/MailingAddress/456";
const customer = {
  id, firstName: "Test", lastName: "Member", email: "test@example.com", phone: null,
  productSubscriberStatus: "NEVER_SUBSCRIBED", defaultAddress: { id: addressId },
  addressesV2: { nodes: [{ id: addressId, address1: "Test Street 1", city: "Vienna", countryCodeV2: "AT" }], pageInfo: { hasNextPage: false } },
};

async function withShopify(run, respond) {
  const originalFetch = globalThis.fetch;
  const originalDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const originalToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  process.env.SHOPIFY_STORE_DOMAIN = "test.myshopify.com";
  process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN = "test-token";
  const calls = [];
  globalThis.fetch = async (_url, options) => {
    const request = JSON.parse(options.body);
    calls.push(request);
    if (respond) return Response.json({ data: respond(request) });
    if (request.query.includes("query ManagedCustomer")) return Response.json({ data: { customer } });
    const field = ["customerUpdateDefaultAddress", "customerAddressCreate", "customerAddressUpdate", "customerAddressDelete", "customerUpdate"]
      .find(field => request.query.includes(`${field}(`));
    return Response.json({ data: { [field]: { userErrors: [] } } });
  };
  try { await run(calls); }
  finally {
    globalThis.fetch = originalFetch;
    if (originalDomain === undefined) delete process.env.SHOPIFY_STORE_DOMAIN;
    else process.env.SHOPIFY_STORE_DOMAIN = originalDomain;
    if (originalToken === undefined) delete process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    else process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN = originalToken;
  }
}

test("profile includes every address page and Shopify's live subscriber status", async () => {
  await withShopify(async calls => {
    const profile = await getCustomerProfile(id);
    assert.equal(profile.addresses.length, 2);
    assert.equal(profile.subscriberStatus, "ACTIVE");
    assert.equal(calls[1].variables.after, "next");
  }, request => ({ customer: {
    ...customer, productSubscriberStatus: "ACTIVE",
    addressesV2: request.variables.after ? {
      nodes: [{ id: "second-address" }], pageInfo: { hasNextPage: false },
    } : { nodes: customer.addressesV2.nodes, pageInfo: { hasNextPage: true, endCursor: "next" } },
  } }));
});

test("personal edits only write permitted fields for the authenticated customer", async () => {
  await withShopify(async calls => {
    await updateCustomerProfile(id, {
      action: "details", customerId: "another-customer", firstName: " New ", lastName: " Name ", phone: "",
      email: "attacker@example.com", tags: ["subscription:active"], metafields: [{ value: "active" }],
    });
    assert.deepEqual(calls[1].variables.input, { id, firstName: "New", lastName: "Name", phone: null });
    assert.equal(calls.length, 3);
  });
});

test("addresses belonging to another customer cannot be modified or removed", async () => {
  for (const action of ["addressUpdate", "addressDelete", "addressDefault"]) {
    await withShopify(async calls => {
      await assert.rejects(updateCustomerProfile(id, { action, addressId: "someone-elses-address" }), /Address not found/);
      assert.equal(calls.length, 1);
    });
  }
});

test("address creation ignores arbitrary fields and sends country and default selection", async () => {
  await withShopify(async calls => {
    await updateCustomerProfile(id, { action: "addressCreate", setAsDefault: true, address: {
      address1: " Test Street 2 ", city: "Vienna", countryCode: "AT", customerId: "another-customer", tags: ["member"],
    } });
    assert.equal(calls[1].variables.customerId, id);
    assert.equal(calls[1].variables.address.address1, "Test Street 2");
    assert.equal(calls[1].variables.address.countryCode, "AT");
    assert.equal(calls[1].variables.setAsDefault, true);
    assert.equal(calls[1].variables.address.customerId, undefined);
    assert.equal(calls[1].variables.address.tags, undefined);
  });
});

test("invalid address input does not reach the mutation", async () => {
  await withShopify(async calls => {
    await assert.rejects(updateCustomerProfile(id, { action: "addressCreate", address: { address1: "Street", city: "Vienna", countryCode: "Austria" } }), /street, city and country/);
    assert.equal(calls.length, 1);
  });
});

test("Shopify validation errors are reported instead of showing a successful save", async () => {
  await withShopify(async () => {
    await assert.rejects(updateCustomerProfile(id, { action: "details", firstName: "Test", lastName: "Member", phone: "bad" }), /Invalid phone/);
  }, request => request.query.includes("query ManagedCustomer")
    ? { customer }
    : { customerUpdate: { userErrors: [{ message: "Invalid phone" }] } });
});
