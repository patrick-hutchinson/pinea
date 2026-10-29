import assert from "node:assert/strict";
import test from "node:test";
import { createHmac } from "node:crypto";
import { verifyShopifySignature } from "./verify.ts";
import { generateGiftCode } from "./code.ts";
import { processGiftOrder } from "./processor.ts";
import { GiftConflict, discountInput } from "./shopify.ts";
import { createRedemptionLink, verifyRedemptionToken } from "./redemption.ts";
import { createGiftCheckout } from "./checkout.ts";
import { escapeHtml, sendGiftEmail } from "./mail.ts";
import type { DeliveryState, GiftConfig, GiftOrder } from "./types.ts";
import type { GiftDependencies, GiftMail } from "./processor.ts";

const config: GiftConfig = {
  shop: "test.myshopify.com", giftVariantId: "gid://shopify/ProductVariant/1",
  membershipProductId: "gid://shopify/Product/2", membershipVariantId: "gid://shopify/ProductVariant/3",
  sellingPlanId: "gid://shopify/SellingPlan/4", cycles: 1, redemptionBaseUrl: "https://example.com",
  from: "hello@mail.example.com", adminEmail: "admin@example.com",
};
const order = (quantity = 1): GiftOrder => ({
  id: "123", email: "buyer@example.com", customer: { first_name: "Buyer", last_name: "Name" },
  line_items: [{ id: "10", variant_id: "1", quantity, properties: [{ name: "Recipient email", value: "recipient@example.com" }] }],
});

function harness() {
  let state: DeliveryState | null = null;
  let revision = 0;
  const created = new Set<string>();
  const mails: GiftMail[] = [];
  let failRecipient = false;
  const deps: GiftDependencies = {
    loadState: async () => ({ marker: state?.units.find((unit) => unit.created)?.code || null,
      state: structuredClone(state), digest: revision ? String(revision) : null, payable: true }),
    saveState: async (_id, value, digest) => {
      if (digest !== (revision ? String(revision) : null)) throw new GiftConflict();
      state = structuredClone(value);
      return String(++revision);
    },
    ensureDiscount: async (_id, _key, code) => { created.add(code); },
    sendMail: async (mail) => {
      if (failRecipient && !mail.copy) throw new Error("Mail unavailable");
      mails.push(structuredClone(mail));
    },
  };
  return { deps, created, mails, state: () => state, failMail: (value: boolean) => { failRecipient = value; } };
}

test("HMAC verifies exact raw UTF-8 bytes and rejects modified or malformed signatures", () => {
  const body = '{"message":"Gr\u00fc\u00dfe"}';
  const signature = createHmac("sha256", "secret").update(body).digest("base64");
  assert.equal(verifyShopifySignature(body, signature, "secret"), true);
  for (const invalid of [null, "", "not base64", signature.slice(0, -1), "A".repeat(43) + "="]) {
    assert.equal(verifyShopifySignature(body, invalid, "secret"), false);
  }
  assert.equal(verifyShopifySignature(body + " ", signature, "secret"), false);
  assert.equal(verifyShopifySignature(body, signature, "wrong-secret"), false);
});

test("gift codes have ten unambiguous random characters", () => {
  const codes = Array.from({ length: 100 }, generateGiftCode);
  assert.equal(new Set(codes).size, 100);
  assert.ok(codes.every((code) => /^GIFT-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{10}$/.test(code)));
});

test("duplicate webhook does not create or send another gift", async () => {
  const h = harness();
  assert.equal((await processGiftOrder(order(), config, h.deps)).status, "completed");
  assert.equal((await processGiftOrder(order(), config, h.deps)).status, "already_processed");
  assert.equal(h.created.size, 1);
  assert.equal(h.mails.length, 2);
});

test("quantity and separate gift lines each receive their own code and emails", async () => {
  const h = harness();
  const input = order(2);
  input.line_items.push({ ...input.line_items[0], id: "11", quantity: 1 });
  await processGiftOrder(input, config, h.deps);
  assert.equal(h.created.size, 3);
  assert.equal(h.mails.length, 6);
});

test("mail failure resumes the persisted code despite gift.discount_code already being present", async () => {
  const h = harness();
  h.failMail(true);
  await assert.rejects(processGiftOrder(order(), config, h.deps), { stage: "email_recipient" });
  const code = h.state()!.units[0].code;
  assert.equal(h.state()!.units[0].created, true);
  h.failMail(false);
  await processGiftOrder(order(), config, h.deps);
  assert.equal(h.created.size, 1);
  assert.equal(h.mails[0].unit.code, code);
});

test("simultaneous deliveries reserve only one set of codes", async () => {
  const h = harness();
  const result = await Promise.all([processGiftOrder(order(), config, h.deps), processGiftOrder(order(), config, h.deps)]);
  assert.deepEqual(result.map((entry) => entry.status).sort(), ["already_running", "completed"]);
  assert.equal(h.created.size, 1);
  assert.equal(h.mails.length, 2);
});

test("missing recipient falls back to buyer without sending duplicate copies", async () => {
  const h = harness();
  const input = order();
  input.line_items[0].properties = [];
  await processGiftOrder(input, config, h.deps);
  assert.equal(h.mails.length, 1);
  assert.equal(h.mails[0].to, input.email);
  assert.equal(h.state()!.units[0].buyerSent, true);
});

test("unrelated lines, including custom lines with no variant, do not create gifts", async () => {
  const h = harness();
  const input = order();
  input.line_items[0].variant_id = "999";
  input.line_items.push({ id: "custom", variant_id: null as unknown as string, quantity: 1 });
  assert.equal((await processGiftOrder(input, config, h.deps)).status, "ignored");
  assert.equal(h.state(), null);
});

test("cancelled or unpaid orders and legacy completed markers are ignored", async () => {
  const h = harness();
  h.deps.loadState = async () => ({ marker: null, state: null, digest: null, payable: false });
  assert.equal((await processGiftOrder(order(), config, h.deps)).status, "not_paid_or_cancelled");
  h.deps.loadState = async () => ({ marker: "GIFT-EXISTING", state: null, digest: null, payable: true });
  assert.equal((await processGiftOrder(order(), config, h.deps)).status, "already_processed");
  assert.equal(h.created.size, 0);
});

test("discount is subscription-only, restricted to the membership product and finite cycles", async () => {
  const h = harness();
  await processGiftOrder(order(), config, h.deps);
  const input = discountInput("gid://shopify/Order/123", "10:1", "GIFT-TEST", h.state()!);
  assert.equal(input.customerGets.value.percentage, 1);
  assert.equal(input.customerGets.appliesOnSubscription, true);
  assert.equal(input.customerGets.appliesOnOneTimePurchase, false);
  assert.deepEqual(input.customerGets.items.products.productsToAdd, [config.membershipProductId]);
  assert.equal(input.recurringCycleLimit, 1);
  assert.equal(input.usageLimit, 1);
  assert.deepEqual(input.context, { all: "ALL" });
  assert.ok(Object.values(input.combinesWith).every((entry) => entry === false));
});

test("redemption details cannot be changed without invalidating the signed link", () => {
  const value = { code: generateGiftCode(), variantId: config.membershipVariantId, sellingPlanId: config.sellingPlanId, cycles: 1 };
  const url = new URL(createRedemptionLink("https://example.com", value, "secret"));
  const token = url.searchParams.get("token")!;
  assert.deepEqual(verifyRedemptionToken(token, "secret"), value);
  assert.equal(verifyRedemptionToken(token, "other"), null);
  assert.equal(verifyRedemptionToken(`e30.${token.split(".")[1]}`, "secret"), null);
});

test("email HTML escapes buyer names and messages", () => {
  assert.equal(escapeHtml('<script>"Hello" & goodbye</script>'), "&lt;script&gt;&quot;Hello&quot; &amp; goodbye&lt;/script&gt;");
});

test("buyer-copy failure resumes only the copy, without resending the recipient email", async () => {
  const h = harness();
  const send = h.deps.sendMail;
  h.deps.sendMail = async (mail) => {
    if (mail.copy) throw new Error("Buyer copy unavailable");
    await send(mail);
  };
  await assert.rejects(processGiftOrder(order(), config, h.deps), { stage: "email_buyer" });
  h.deps.sendMail = send;
  await processGiftOrder(order(), config, h.deps);
  assert.equal(h.mails.filter((mail) => !mail.copy).length, 1);
  assert.equal(h.mails.filter((mail) => mail.copy).length, 1);
});

test("interrupted discount creation reuses the reserved random code", async () => {
  const h = harness();
  const create = h.deps.ensureDiscount;
  h.deps.ensureDiscount = async (...args) => {
    await create(...args);
    throw new Error("Response lost after successful creation");
  };
  await assert.rejects(processGiftOrder(order(), config, h.deps), { stage: "create_discount" });
  const code = h.state()!.units[0].code;
  h.deps.ensureDiscount = create;
  await processGiftOrder(order(), config, h.deps);
  assert.equal(h.created.size, 1);
  assert.equal(h.mails[0].unit.code, code);
});

test("Resend retries rate limits using the same role-specific idempotency key", async () => {
  const h = harness();
  await processGiftOrder(order(), config, h.deps);
  const originalFetch = globalThis.fetch;
  const oldKey = process.env.RESEND_API_KEY;
  const oldSecret = process.env.GIFT_LINK_SECRET;
  const requests: RequestInit[] = [];
  process.env.RESEND_API_KEY = "test-key";
  process.env.GIFT_LINK_SECRET = "test-secret";
  globalThis.fetch = async (_url, options) => {
    requests.push(options!);
    return requests.length === 1
      ? new Response(null, { status: 429, headers: { "retry-after": "0.001" } })
      : Response.json({ id: "test-message" });
  };
  try {
    await sendGiftEmail(h.mails[0], config);
    await sendGiftEmail(h.mails[1], config);
    assert.equal(requests.length, 3);
    const keys = requests.map((request) => (request.headers as Record<string, string>)["Idempotency-Key"]);
    assert.equal(keys[0], keys[1]);
    assert.notEqual(keys[0], keys[2]);
    assert.equal(requests[0].body, requests[1].body);
  } finally {
    globalThis.fetch = originalFetch;
    if (oldKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = oldKey;
    if (oldSecret === undefined) delete process.env.GIFT_LINK_SECRET; else process.env.GIFT_LINK_SECRET = oldSecret;
  }
});

test("checkout includes the selling plan and refuses inapplicable discounts", async () => {
  const oldFetch = globalThis.fetch;
  const oldDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const oldToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  process.env.SHOPIFY_STORE_DOMAIN = "test.myshopify.com";
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "test-storefront-token";
  const gift = { code: generateGiftCode(), variantId: config.membershipVariantId, sellingPlanId: config.sellingPlanId, cycles: 1 };
  let applicable = true;
  globalThis.fetch = async (_url, options) => {
    const { variables } = JSON.parse(String(options!.body));
    assert.deepEqual(variables.input.lines, [{ merchandiseId: gift.variantId, sellingPlanId: gift.sellingPlanId, quantity: 1 }]);
    assert.deepEqual(variables.input.discountCodes, [gift.code]);
    return Response.json({ data: { cartCreate: { userErrors: [], cart: {
      checkoutUrl: "https://test.myshopify.com/checkouts/test",
      discountCodes: [{ code: gift.code, applicable }],
      lines: { nodes: [{ sellingPlanAllocation: { sellingPlan: { id: gift.sellingPlanId } } }] },
    } } } });
  };
  try {
    assert.equal(await createGiftCheckout(gift), "https://test.myshopify.com/checkouts/test");
    applicable = false;
    await assert.rejects(createGiftCheckout(gift), /not applicable/);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldDomain === undefined) delete process.env.SHOPIFY_STORE_DOMAIN; else process.env.SHOPIFY_STORE_DOMAIN = oldDomain;
    if (oldToken === undefined) delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN; else process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = oldToken;
  }
});
