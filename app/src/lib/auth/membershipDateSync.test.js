import assert from "node:assert/strict";
import test from "node:test";
import { isMembershipDateSyncPending as pending, withMembershipDateSyncState } from "./membershipDateSync.js";

const session = { email: "member@example.com", hasActiveSubscription: true, subscriptionVerification: "verified",
  subscriptionStatus: "ACTIVE", contractId: "gid://shopify/SubscriptionContract/1",
  subscriptionStartDate: "2026-11-09T10:00:00Z", nextBillingDate: "2027-11-09T10:00:00Z" };
const recipients = [{ email: " MEMBER@example.com ", renewal_date: "2027-05-20", billing_alignment_confirmed: "false" }];

test("only matched carry-over members with their initial unadjusted cycle see the notice", () => {
  assert.equal(pending(session, recipients), true);
  assert.equal(pending({ ...session, email: "new-online@example.com" }, recipients), false);
  assert.equal(pending(session, []), false);
  assert.equal(pending(session, [...recipients, ...recipients]), false);
});

test("a live billing-cycle adjustment clears the notice, even if the contract date stays unchanged", () => {
  assert.equal(pending({ ...session, effectiveNextBillingDate: "2027-05-20T12:00:00Z" }, recipients), false);
  assert.equal(pending({ ...session, nextBillingDate: "2027-05-20T12:00:00Z" }, recipients), false);
  assert.equal(pending(session, [{ ...recipients[0], billing_alignment_confirmed: "true" }]), false);
});

test("later annual renewals and already-correct initial dates do not show the notice", () => {
  assert.equal(pending({ ...session, nextBillingDate: "2028-11-09T10:00:00Z" }, recipients), false);
  assert.equal(pending(session, [{ ...recipients[0], renewal_date: "2027-11-09" }]), false);
});

test("date-free carry-over entries clear once their initial billing date changes", () => {
  const dateFree = [{ email: session.email }];
  assert.equal(pending(session, dateFree), true);
  assert.equal(pending({ ...session, effectiveNextBillingDate: "2027-05-20T12:00:00Z" }, dateFree), false);
});

test("three-year carry-over terms and leap-day activations are handled", () => {
  assert.equal(pending({ ...session, effectiveNextBillingDate: "2029-05-20" }, [{ ...recipients[0], renewal_date: "2029-05-20" }]), false);
  assert.equal(pending({ ...session, subscriptionStartDate: "2024-02-29T12:00:00Z", nextBillingDate: "2025-02-28T12:00:00Z" }, recipients), true);
});

test("the display-only notice cannot grant access to inactive, unverified or cancelled accounts", async () => {
  for (const changes of [{ hasActiveSubscription: false }, { subscriptionVerification: "unavailable" },
    { subscriptionStatus: "CANCELLED" }, { contractId: null }]) {
    assert.equal(pending({ ...session, ...changes }, recipients), false);
  }
  const result = await withMembershipDateSyncState({ email: session.email, hasActiveSubscription: false });
  assert.deepEqual(result, { email: session.email, hasActiveSubscription: false, subscriptionDateSyncPending: false });
});
