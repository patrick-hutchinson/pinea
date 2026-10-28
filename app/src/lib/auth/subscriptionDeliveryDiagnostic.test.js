import assert from "node:assert/strict";
import test from "node:test";
import { checkSubscriptionDeliveryAccess } from "./subscriptionDeliveryDiagnostic.js";

const options = {
  apiUrl: "https://example.com/customer/graphql",
  accessToken: "private-token",
  origin: "https://preview.example.com",
  contractId: "gid://shopify/SubscriptionContract/123",
};

test("delivery access diagnostic", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });

  await t.test("skips accounts without an active contract", async () => {
    globalThis.fetch = () => { throw new Error("Must not request"); };
    assert.deepEqual(await checkSubscriptionDeliveryAccess({ ...options, contractId: null }), {
      outcome: "skipped_no_active_contract",
    });
  });

  await t.test("only fetches options, never submits an address or selects a method", async () => {
    globalThis.fetch = async (url, request) => {
      assert.equal(url, options.apiUrl);
      assert.equal(request.headers.Authorization, options.accessToken);
      assert.equal(request.cache, "no-store");
      assert.ok(request.signal);
      const body = JSON.parse(request.body);
      assert.deepEqual(body.variables, { subscriptionContractId: options.contractId });
      assert.match(body.query, /subscriptionContractFetchDeliveryOptions/);
      assert.doesNotMatch(body.query, /subscriptionContractSelectDeliveryMethod|shippingAddress|address:/);
      return Response.json({ data: { subscriptionContractFetchDeliveryOptions: {
        deliveryOptionsResult: { __typename: "SubscriptionDeliveryOptionsResultSuccess" }, userErrors: [],
      } } });
    };
    assert.deepEqual(await checkSubscriptionDeliveryAccess(options), { outcome: "delivery_options_available" });
  });

  await t.test("recognizes access denial without exposing raw error messages", async () => {
    globalThis.fetch = async () => Response.json({ errors: [{
      message: "Sensitive details", extensions: { code: "ACCESS_DENIED" },
    }] });
    assert.deepEqual(await checkSubscriptionDeliveryAccess(options), {
      outcome: "access_denied", httpStatus: 200, errorCodes: ["ACCESS_DENIED"],
    });
  });

  for (const [result, outcome] of [
    [{ deliveryOptionsResult: null, userErrors: [] }, "delivery_options_pending"],
    [{ deliveryOptionsResult: { __typename: "SubscriptionDeliveryOptionsResultFailure" }, userErrors: [] }, "delivery_options_unavailable"],
    [{ userErrors: [{ code: "INVALID", message: "Private address" }] }, "delivery_validation_failed"],
  ]) {
    await t.test(outcome, async () => {
      globalThis.fetch = async () => Response.json({ data: { subscriptionContractFetchDeliveryOptions: result } });
      const diagnostic = await checkSubscriptionDeliveryAccess(options);
      assert.equal(diagnostic.outcome, outcome);
      assert.ok(!JSON.stringify(diagnostic).includes("Private address"));
    });
  }

  await t.test("network failures and timeouts return safe results instead of failing login", async () => {
    globalThis.fetch = async () => { throw new Error("private-token"); };
    assert.deepEqual(await checkSubscriptionDeliveryAccess(options), { outcome: "request_failed" });
    globalThis.fetch = async () => { throw new DOMException("Timeout", "TimeoutError"); };
    assert.deepEqual(await checkSubscriptionDeliveryAccess(options), { outcome: "request_timed_out" });
  });
});
