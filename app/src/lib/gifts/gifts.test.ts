import assert from "node:assert/strict";
import test from "node:test";
import { createHmac } from "node:crypto";
import { verifyShopifySignature } from "./verify.ts";
import { generateGiftCode } from "./code.ts";
import { processGiftOrder } from "./processor.ts";
import { GiftConflict, discountInput } from "./shopify.ts";
import { createRedemptionLink, verifyRedemptionToken } from "./redemption.ts";
import { createGiftCheckout } from "./checkout.ts";
import { escapeHtml, giftEmailContent, sendGiftEmail } from "./mail.ts";
import { buildGiftCartAttributes, getGiftMembershipGroups } from "../../helpers/giftMembershipOptions.js";
import type { DeliveryState, GiftConfig, GiftOrder } from "./types.ts";
import type { GiftDependencies, GiftMail } from "./processor.ts";
import {giftFailureDetails} from './diagnostics.ts';
import {createGiftRetryHandler} from './retry.ts';
import {loadGiftRetryOrder, normalizeGiftOrderId} from './retryOrder.ts';
import {getShopifyAdminAccessDiagnostics} from '../shopifySubscriptions.js';

test('Admin diagnostics identify the actual authenticated app and granted scopes without exposing credentials', async (context) => {
  const keys = ['SHOPIFY_STORE_DOMAIN', 'SHOPIFY_ADMIN_TOKEN'];
  const before = keys.map((key) => process.env[key]);
  process.env.SHOPIFY_STORE_DOMAIN = 'test.myshopify.com';
  process.env.SHOPIFY_ADMIN_TOKEN = 'secret-admin-token';
  context.after(() => keys.forEach((key, index) => {
    if (before[index] === undefined) delete process.env[key]; else process.env[key] = before[index];
  }));
  context.mock.method(globalThis, 'fetch', async (_url, options) => {
    assert.equal((options!.headers as Record<string, string>)['X-Shopify-Access-Token'], 'secret-admin-token');
    assert.match(JSON.parse(String(options!.body)).query, /currentAppInstallation/);
    return Response.json({data: {currentAppInstallation: {app: {id: 'gid://shopify/App/123', title: 'Backend Access'},
      accessScopes: [{handle: 'write_orders'}, {handle: 'write_discounts'}]}}});
  });
  const details = await getShopifyAdminAccessDiagnostics();
  assert.equal(details.credentialSource, 'SHOPIFY_ADMIN_TOKEN');
  assert.equal(details.authMode, 'static_token');
  assert.deepEqual(details.grantedScopes, ['write_orders', 'write_discounts']);
  assert.equal(details.app.title, 'Backend Access');
  assert.ok(!JSON.stringify(details).includes('secret-admin-token'));
});

const retrySecret = 'test-only-retry-secret-at-least-32-characters';
const retryRequest = (body: unknown, secret = retrySecret) => new Request('https://example.com/api/gifts/retry', {
  method: 'POST', headers: {Authorization: `Bearer ${secret}`}, body: JSON.stringify(body),
});

test('retry requires a dedicated secret and a valid order ID before accessing Shopify', async () => {
  let reads = 0;
  const h = harness();
  let secret: string | undefined = retrySecret;
  const handler = createGiftRetryHandler({getSecret: () => secret, getConfig: () => config,
    loadOrder: async () => {reads++; return order();}, ...h.deps,
    loadState: async () => {reads++; return h.deps.loadState('id');}, sendMail: h.deps.sendMail});
  assert.equal((await handler(retryRequest({orderId: '123'}, 'wrong'))).status, 401);
  assert.equal((await handler(retryRequest({orderId: '#1025'}))).status, 400);
  assert.equal((await handler(retryRequest({orderId: '123', send: 'true'}))).status, 400);
  secret = undefined;
  assert.equal((await handler(retryRequest({orderId: '123'}))).status, 503);
  assert.equal(reads, 0);
  assert.equal(normalizeGiftOrderId('123'), 'gid://shopify/Order/123');
  assert.equal(normalizeGiftOrderId('gid://shopify/Order/123'), 'gid://shopify/Order/123');
  assert.equal(normalizeGiftOrderId('gid://shopify/Customer/123'), null);
});

test('retry defaults to read-only, then resumes failed delivery without duplicate codes or completed emails', async () => {
  const h = harness();
  const handler = createGiftRetryHandler({getSecret: () => retrySecret, getConfig: () => config,
    loadOrder: async () => order(), ...h.deps, sendMail: h.deps.sendMail});
  const dry = await handler(retryRequest({orderId: '123'}));
  assert.equal((await dry.json()).status, 'dry_run');
  assert.equal(h.created.size, 0);
  assert.equal(h.mails.length, 0);
  assert.equal(h.state(), null);
  h.failMail(true);
  const failed = await handler(retryRequest({orderId: '123', send: true}));
  assert.equal(failed.status, 500);
  assert.equal((await failed.json()).stage, 'email_recipient');
  assert.equal(h.created.size, 1);
  const code = h.state()!.units[0].code;
  h.failMail(false);
  const result = await handler(retryRequest({orderId: '123', send: true}));
  assert.equal((await result.json()).status, 'completed');
  assert.equal(h.created.size, 1);
  assert.equal(h.state()!.units[0].code, code);
  assert.equal(h.mails.length, 2);
  const again = await handler(retryRequest({orderId: '123', send: true}));
  const json = await again.json();
  assert.equal(json.status, 'already_processed');
  assert.equal(h.mails.length, 2);
  assert.ok(!JSON.stringify(json).includes('recipient@example.com'));
  assert.ok(!JSON.stringify(json).includes(code));
});

test('retry refuses unpaid orders and active processing leases', async () => {
  const h = harness();
  let payable = false;
  let reads = 0;
  const handler = createGiftRetryHandler({getSecret: () => retrySecret, getConfig: () => config,
    loadOrder: async () => {reads++; return order();}, ...h.deps,
    loadState: async () => ({payable, marker: null, digest: null, state: payable ? {
      version: 1, cycles: 1, units: [], startedAt: new Date().toISOString(), sellingPlanId: config.sellingPlanId,
      leaseToken: 'test', leaseUntil: new Date(Date.now() + 60_000).toISOString(),
    } : null}), sendMail: h.deps.sendMail});
  assert.equal((await (await handler(retryRequest({orderId: '123', send: true}))).json()).status, 'not_paid_or_cancelled');
  payable = true;
  assert.equal((await (await handler(retryRequest({orderId: '123', send: true}))).json()).status, 'already_running');
  assert.equal(reads, 0);
  assert.equal(h.mails.length, 0);
});

test('retry returns sanitized Shopify errors synchronously', async () => {
  const h = harness();
  const handler = createGiftRetryHandler({getSecret: () => retrySecret, getConfig: () => config,
    loadOrder: async () => order(), ...h.deps,
    loadState: async () => {throw new Error('Access denied for order field. Required access: `read_orders` secret@example.com');},
    sendMail: h.deps.sendMail,
    accessDiagnostics: async () => ({app: {title: 'Actual app'}, grantedScopes: ['read_products'], credentialSource: 'SHOPIFY_CLIENT_ID'})});
  const response = await handler(retryRequest({orderId: '123'}));
  assert.equal(response.status, 500);
  const json = await response.json();
  assert.equal(json.stage, 'load_order');
  assert.equal(json.reason, 'shopify_access_denied');
  assert.deepEqual(json.requiredScopes, ['read_orders']);
  assert.equal(json.adminAccess.app.title, 'Actual app');
  assert.deepEqual(json.adminAccess.grantedScopes, ['read_products']);
  assert.ok(!JSON.stringify(json).includes('secret@example.com'));
});

test('retry loader paginates and preserves line IDs, recipient details, language and selling-plan detection', async () => {
  let calls = 0;
  const loaded = await loadGiftRetryOrder('123', async (_query, variables) => {
    calls++;
    assert.equal(variables.id, 'gid://shopify/Order/123');
    return {order: {id: variables.id, email: 'buyer@example.com', customer: {firstName: 'Buyer', lastName: 'Name'},
      lineItems: {nodes: [{id: `gid://shopify/LineItem/${calls * 10}`, quantity: 1, currentQuantity: 1,
        variant: {id: 'gid://shopify/ProductVariant/1'}, sellingPlan: calls === 2 ? {name: 'Annual'} : null,
        customAttributes: [{key: 'Recipient email', value: 'recipient@example.com'}, {key: 'Recipient language', value: 'en'}]}],
        pageInfo: {hasNextPage: calls === 1, endCursor: 'second-page'}}}};
  });
  assert.equal(calls, 2);
  assert.equal(loaded.line_items[0].id, '10');
  assert.equal(loaded.customer!.first_name, 'Buyer');
  assert.equal(loaded.line_items[0].properties![1].value, 'en');
  assert.ok(loaded.line_items[1].selling_plan_allocation);
});

test('retry loader rejects mismatched orders, changed quantities and incomplete pagination', async () => {
  const raw = () => ({order: {id: 'gid://shopify/Order/123', email: 'buyer@example.com', lineItems: {
    nodes: [{id: 'gid://shopify/LineItem/10', quantity: 1, currentQuantity: 1}],
    pageInfo: {hasNextPage: false, endCursor: null as string | null},
  }}});
  const wrong = raw(); wrong.order.id = 'gid://shopify/Order/456';
  await assert.rejects(loadGiftRetryOrder('123', async () => wrong), /not accessible/);
  const edited = raw(); edited.order.lineItems.nodes[0].currentQuantity = 0;
  await assert.rejects(loadGiftRetryOrder('123', async () => edited), /quantities changed/);
  const incomplete = raw(); incomplete.order.lineItems.pageInfo.hasNextPage = true;
  await assert.rejects(loadGiftRetryOrder('123', async () => incomplete), /Incomplete/);
  incomplete.order.lineItems.pageInfo.endCursor = 'same-cursor';
  await assert.rejects(loadGiftRetryOrder('123', async () => incomplete), /Incomplete/);
});

test('gift failure diagnostics expose only safe operational details', () => {
  assert.deepEqual(giftFailureDetails(new Error('Missing GIFT_CYCLES')), {reason: 'missing_environment_variable', variable: 'GIFT_CYCLES'});
  assert.deepEqual(giftFailureDetails(new Error('Gift email request failed (403)')), {reason: 'resend_request_failed', httpStatus: 403});
  assert.deepEqual(giftFailureDetails(new Error('Shopify Admin request failed (401).')), {reason: 'shopify_admin_request_failed', httpStatus: 401});
  assert.deepEqual(giftFailureDetails(new Error('Access denied for order field. Required access: `read_orders` access scope. recipient@example.com')), {
    reason: 'shopify_access_denied', fields: ['order'], requiredScopes: ['read_orders'],
  });
  assert.deepEqual(giftFailureDetails(new Error("Field 'compareDigest' doesn't exist on type 'Metafield'")), {
    reason: 'shopify_graphql_field_unavailable', field: 'compareDigest', type: 'Metafield',
  });
  assert.deepEqual(giftFailureDetails(new Error('Shopify token exchange failed: invalid_client secret-token')), {
    reason: 'shopify_token_exchange_failed', code: 'invalid_client',
  });
  assert.deepEqual(giftFailureDetails(new Error('This app is not approved to access the Order object.')), {
    reason: 'shopify_protected_customer_data_access_required',
  });
  assert.deepEqual(giftFailureDetails(Object.assign(new Error('/private/template'), {code: 'ENOENT'})), {reason: 'missing_runtime_file'});
  const details = giftFailureDetails(new Error('recipient@example.com secret-token confidential-message'));
  assert.deepEqual(details, {reason: 'unexpected_processing_error'});
});

const config: GiftConfig = {
  shop: "test.myshopify.com", sellingPlanId: "gid://shopify/SellingPlan/4", giftVariants: {
    "gid://shopify/ProductVariant/1": {
      membershipProductId: "gid://shopify/Product/2", membershipVariantId: "gid://shopify/ProductVariant/3", region: "AT",
    },
  }, cycles: 1, redemptionBaseUrl: "https://example.com",
  from: "hello@mail.example.com", adminEmail: "admin@example.com",
};
const order = (quantity = 1): GiftOrder => ({
  id: "123", email: "buyer@example.com", customer: { first_name: "Buyer", last_name: "Name" },
  line_items: [{ id: "10", variant_id: "1", quantity, properties: [{ name: "Recipient email", value: "recipient@example.com" }] }],
});

test("restored gift selection and form attributes reach the coupon email unchanged", async () => {
  const h = harness();
  const [group] = getGiftMembershipGroups([{
    id: "gid://shopify/ProductVariant/1", title: "Member / AT",
    selectedOptions: [{ name: "Membership", value: "Member" }, { name: "Region", value: "AT" }],
  }]);
  const selected = group.variants[0];
  const message = 'Enjoy <b>your gift</b> & celebrate!\nKeep $& and {{code}} literal.';
  const attributes = buildGiftCartAttributes({ recipientEmail: "  recipient@example.com  ", message, language: "en" });
  assert.deepEqual(attributes.map(({ key }) => key), ["Recipient email", "Message", "Recipient language"]);
  const input = order();
  input.line_items[0].variant_id = selected.id;
  input.line_items[0].properties = attributes.map(({ key, value }) => ({ name: key, value }));
  await processGiftOrder(input, config, h.deps);
  assert.equal(h.mails[0].to, "recipient@example.com");
  assert.equal(h.mails[0].message, message);
  assert.equal(h.mails[0].language, 'en');
  assert.equal(h.mails[1].language, 'en');
  assert.equal(h.state()!.units[0].language, 'en');
  assert.equal(h.mails[0].unit.variantId, config.giftVariants[selected.id].membershipVariantId);
  const oldSecret = process.env.GIFT_LINK_SECRET;
  process.env.GIFT_LINK_SECRET = "test-secret";
  try {
    const content = giftEmailContent(h.mails[0], config);
    assert.ok(content.html.includes("Enjoy &lt;b&gt;your gift&lt;/b&gt; &amp; celebrate!<br />Keep $&amp; and {{code}} literal."));
    assert.ok(content.text.includes(message));
    assert.ok(!content.html.includes("<b>your gift</b>"));
  } finally {
    if (oldSecret === undefined) delete process.env.GIFT_LINK_SECRET; else process.env.GIFT_LINK_SECRET = oldSecret;
  }
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

test("each selected gift variant keeps its matching regional membership variant", async () => {
  const h = harness();
  const regionalConfig: GiftConfig = {
    ...config,
    giftVariants: {
      ...config.giftVariants,
      "gid://shopify/ProductVariant/2": {
        membershipProductId: "gid://shopify/Product/2", membershipVariantId: "gid://shopify/ProductVariant/4", region: "EU",
      },
      "gid://shopify/ProductVariant/3": {
        membershipProductId: "gid://shopify/Product/3", membershipVariantId: "gid://shopify/ProductVariant/5", region: "WORLD",
      },
    },
  };
  const input = order();
  input.line_items.push(
    { ...input.line_items[0], id: "11", variant_id: "2" },
    { ...input.line_items[0], id: "12", variant_id: "3" },
  );

  await processGiftOrder(input, regionalConfig, h.deps);
  assert.deepEqual(h.state()!.units.map((unit) => [unit.region, unit.variantId]), [
    ["AT", "gid://shopify/ProductVariant/3"],
    ["EU", "gid://shopify/ProductVariant/4"],
    ["WORLD", "gid://shopify/ProductVariant/5"],
  ]);
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
  const unit = h.state()!.units[0];
  const input = discountInput("gid://shopify/Order/123", "10:1", "GIFT-TEST", unit, h.state()!);
  assert.equal(input.customerGets.value.percentage, 1);
  assert.equal(input.customerGets.appliesOnSubscription, true);
  assert.equal(input.customerGets.appliesOnOneTimePurchase, false);
  assert.deepEqual(input.customerGets.items.products.productsToAdd, [unit.productId]);
  assert.equal(input.recurringCycleLimit, 1);
  assert.equal(input.usageLimit, 1);
  assert.deepEqual(input.context, { all: "ALL" });
  assert.ok(Object.values(input.combinesWith).every((entry) => entry === false));
});

test("redemption details cannot be changed without invalidating the signed link", () => {
  const value = { code: generateGiftCode(), variantId: "gid://shopify/ProductVariant/3", sellingPlanId: config.sellingPlanId, cycles: 1 };
  const url = new URL(createRedemptionLink("https://example.com", value, "secret"));
  const token = url.searchParams.get("token")!;
  assert.deepEqual(verifyRedemptionToken(token, "secret"), value);
  assert.equal(verifyRedemptionToken(token, "other"), null);
  assert.equal(verifyRedemptionToken(`e30.${token.split(".")[1]}`, "secret"), null);
});

test("email HTML escapes buyer names and messages", () => {
  assert.equal(escapeHtml('<script>"Hello" & goodbye</script>'), "&lt;script&gt;&quot;Hello&quot; &amp; goodbye&lt;/script&gt;");
});

test("gift email uses the established member-email template with the generated code and checkout link", () => {
  const oldSecret = process.env.GIFT_LINK_SECRET;
  process.env.GIFT_LINK_SECRET = "test-secret";
  try {
    const content = giftEmailContent({
      to: "recipient@example.com", buyerName: "Buyer", recipientName: "Recipient", message: "Enjoy & celebrate",
      orderId: "gid://shopify/Order/123", copy: false, state: {
        version: 1, startedAt: "2026-01-01T00:00:00.000Z", cycles: 1,
        sellingPlanId: config.sellingPlanId, leaseUntil: "", leaseToken: "", units: [],
      }, unit: {
        key: "10:1", code: "GIFT-ABCDEFGHJK", productId: "gid://shopify/Product/2",
        variantId: "gid://shopify/ProductVariant/3", sellingPlanId: config.sellingPlanId,
      },
    }, config, new Date('2026-12-31T23:30:00Z'));
    assert.match(content.html!, /Hallo Recipient,/);
    assert.match(content.html!, />01\/2027<\/div>/);
    assert.ok(!content.html!.includes('{{sendDate}}'));
    assert.match(content.html!, /Buyer hat dir eine P\.IN\.E\.A Membership geschenkt/);
    assert.match(content.html!, /GIFT-ABCDEFGHJK/);
    assert.match(content.html!, /api\/gifts\/redeem\?token=/);
    assert.match(content.html!, /Enjoy &amp; celebrate/);
    assert.match(content.html!, /Danke, dass du Teil von P.IN.E.A bist/);
    assert.match(content.html!, /ersten 1 Abrechnungszyklen/);
    assert.match(content.html!, /Abo verwalten/);
    assert.ok(!content.html!.includes('{{ Safe'));
    assert.ok(!content.html!.includes('[CODE]'));
    assert.ok(!content.html!.includes('Der Code funktioniert nur mit dieser'));
    assert.ok(!/\{\{(?:greetingName|intro|messageBlock|code|checkoutUrl|terms|cancellation|manageUrl)\}\}/.test(content.html!));
    assert.match(content.html!, /@font-face/);
    assert.ok(content.html!.includes('https://www.pinea-periodical.com/fonts/HBMarginSWebv0.45-375.woff2'));
    assert.ok(content.html!.includes('font-family: "HBMarginS", "Helvetica Neue", "Segoe UI", Helvetica, sans-serif;'));
  } finally {
    if (oldSecret === undefined) delete process.env.GIFT_LINK_SECRET; else process.env.GIFT_LINK_SECRET = oldSecret;
  }
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

test('both gift languages preserve links, date, escaped quotes, and optional message placement', async () => {
  const h = harness();
  await processGiftOrder(order(), config, h.deps);
  assert.equal(h.mails[0].language, 'de');
  const oldSecret = process.env.GIFT_LINK_SECRET;
  process.env.GIFT_LINK_SECRET = 'language-test';
  try {
    for (const language of ['de', 'en'] as const) {
      for (const copy of [false, true]) {
        const mail = {...h.mails[0], language, copy, message: '<b>Hello</b> & welcome!\nSecond line'};
        const {html, subject, text} = giftEmailContent(mail, config, new Date('2026-12-31T23:30:00Z'));
        assert.ok(html.includes(`lang="${language}"`));
        assert.match(html, />01\/2027<\/div>/);
        assert.ok(html.includes(language === 'en' ? 'You have been gifted a membership!' : 'Du hast eine Membership geschenkt bekommen!'));
        assert.match(html, /<em>&(?:ldquo|bdquo);&lt;b&gt;Hello&lt;\/b&gt; &amp; welcome!<br \/>Second line&rdquo;<\/em>/);
        const photoIndex = html.indexOf(language === 'en' ? 'Photo: Philipp Niemeyer' : 'Foto: Philipp Niemeyer');
        assert.ok(photoIndex >= 0 && photoIndex < html.indexOf('<em>'));
        assert.ok(!html.includes('{{messageBlock}}') && !html.includes('{{ Safe') && !html.includes('[CODE]'));
        assert.ok(subject.includes(language === 'en' ? copy ? 'Your copy' : 'gifted' : copy ? 'Deine Kopie' : 'geschenkt'));
        assert.ok(text.includes('<b>Hello</b> & welcome!'));
        const href = html.match(/href="([^"]*\/api\/gifts\/redeem\?token=[^"]+)"/)![1];
        const redemption = verifyRedemptionToken(new URL(href).searchParams.get('token')!, 'language-test')!;
        assert.equal(redemption.language, language);
        assert.equal(redemption.code, mail.unit.code);
        const empty = giftEmailContent({...mail, message: '  '}, config).html;
        assert.ok(!empty.includes('<em>'));
        assert.ok(!empty.includes('{{messageBlock}}'));
      }
    }
  } finally {
    if (oldSecret === undefined) delete process.env.GIFT_LINK_SECRET; else process.env.GIFT_LINK_SECRET = oldSecret;
  }
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
  const gift = { code: generateGiftCode(), variantId: "gid://shopify/ProductVariant/3", sellingPlanId: config.sellingPlanId, cycles: 1 };
  let applicable = true;
  let expectedLanguage = 'DE';
  globalThis.fetch = async (_url, options) => {
    const { query, variables } = JSON.parse(String(options!.body));
    assert.match(query, /@inContext\(language: \$language\)/);
    assert.equal(variables.language, expectedLanguage);
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
    expectedLanguage = 'EN';
    assert.equal(await createGiftCheckout({...gift, language: 'en'}), "https://test.myshopify.com/checkouts/test");
    expectedLanguage = 'DE';
    applicable = false;
    await assert.rejects(createGiftCheckout(gift), /not applicable/);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldDomain === undefined) delete process.env.SHOPIFY_STORE_DOMAIN; else process.env.SHOPIFY_STORE_DOMAIN = oldDomain;
    if (oldToken === undefined) delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN; else process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = oldToken;
  }
});
