import assert from "node:assert/strict";
import test from "node:test";
import { getCurrentGiftEntitlement, getGiftTagChanges, isGiftReminderDue, reconcileGiftCustomers } from "./giftMembershipLifecycle.js";

const now = new Date("2026-10-28T09:00:00Z");
const gift = (overrides = {}) => ({
  _id: "gift-1", shopifyCustomerId: "customer-1", status: "active", tier: "Member",
  email: "recipient@example.com", startsAt: "2026-01-01T00:00:00Z", endsAt: "2026-11-01T00:00:00Z",
  ...overrides,
});

test("access expires at the exact end time, and future gifts are not yet active", () => {
  assert.equal(getCurrentGiftEntitlement([gift({ endsAt: now.toISOString() })], now), null);
  assert.equal(getCurrentGiftEntitlement([gift({ startsAt: "2026-11-01T00:00:00Z" })], now), null);
  assert.equal(getCurrentGiftEntitlement([gift({ status: "revoked" })], now), null);
});

test("an expired gift cannot replace a newer active gift", () => {
  const current = gift({ _id: "new", tier: "Member Plus", endsAt: "2027-01-01T00:00:00Z" });
  assert.equal(getCurrentGiftEntitlement([gift({ endsAt: "2026-10-01T00:00:00Z" }), current], now), current);
});

test("expiry and tier changes only remove gift tags, preserving paid membership and other tags", () => {
  const tags = ["subscription:active", "subscription_tier:Member Plus", "newsletter", "gift-membership-active", "gift-membership-tier:member"];
  assert.deepEqual(getGiftTagChanges(tags, null), {
    add: [], remove: ["gift-membership-active", "gift-membership-tier:member"],
  });
  assert.deepEqual(getGiftTagChanges(tags, "Member Plus"), {
    add: ["gift-membership-tier:member_plus"], remove: ["gift-membership-tier:member"],
  });
});

test("reminders only target the current gift in the seven-day window and skip sent or extended gifts", () => {
  const current = gift();
  assert.equal(isGiftReminderDue(current, [current], now), true);
  assert.equal(isGiftReminderDue({ ...current, renewalReminderSentAt: now.toISOString() }, [current], now), false);
  assert.equal(isGiftReminderDue(current, [current], new Date("2026-10-20T00:00:00Z")), false);
  const queued = gift({ _id: "queued", startsAt: current.endsAt, endsAt: "2027-11-01T00:00:00Z" });
  assert.equal(isGiftReminderDue(current, [current, queued], now), false);
  assert.equal(isGiftReminderDue(queued, [current, queued], now), false);
});

test("a failed customer does not stop the job and is retried on the next run", async () => {
  const attempts = [];
  const records = [];
  let fail = true;
  const dependencies = {
    customerIds: ["customer-1", "customer-2"],
    loadEntitlements: async () => [gift({ startsAt: "2000-01-01T00:00:00Z", endsAt: "2099-01-01T00:00:00Z" })],
    syncCustomer: async (customerId) => {
      attempts.push(customerId);
      if (fail && customerId === "customer-1") throw new Error("Temporary Shopify failure");
    },
    recordSync: async (entry) => records.push(entry),
  };
  assert.equal((await reconcileGiftCustomers(dependencies)).failed, 1);
  assert.deepEqual(attempts, ["customer-1", "customer-2"]);
  assert.equal(records[0].status, "failed");
  fail = false;
  assert.equal((await reconcileGiftCustomers(dependencies)).failed, 0);
  assert.equal(records[2].status, "synced");
});

test("dry run reports expiry without calling write adapters", async () => {
  const result = await reconcileGiftCustomers({
    customerIds: ["customer-1"], loadEntitlements: async () => [gift({ startsAt: "2000-01-01T00:00:00Z", endsAt: "2001-01-01T00:00:00Z" })],
    syncCustomer: () => assert.fail("dry run must not write to Shopify"),
    recordSync: () => assert.fail("dry run must not write to Sanity"), dryRun: true,
  });
  assert.equal(result.failed, 0);
  assert.deepEqual(result.results[0].expiredIds, ["gift-1"]);
  assert.equal(result.results[0].entitlementId, null);
});

test("invalid active dates are reported instead of clearing Shopify membership", async () => {
  const result = await reconcileGiftCustomers({
    customerIds: ["customer-1"], loadEntitlements: async () => [gift({ endsAt: "invalid" })],
    syncCustomer: () => assert.fail("invalid data must not change Shopify"),
    recordSync: async () => {},
  });
  assert.equal(result.failed, 1);
  assert.match(result.results[0].error, /Invalid gift membership dates/);
});
