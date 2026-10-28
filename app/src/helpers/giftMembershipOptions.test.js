import assert from "node:assert/strict";
import test from "node:test";
import { getGiftMembershipGroups } from "./giftMembershipOptions.js";

const variant = (membership, region, amount = "60") => ({
  id: `${membership}-${region}`,
  title: `${membership} / ${region}`,
  selectedOptions: [
    { name: "Membership", value: membership },
    { name: "Region", value: region },
  ],
  price: { amount, currencyCode: "EUR" },
  availableForSale: true,
});

test("groups the six gift variants while preserving checkout IDs and prices", () => {
  const variants = [
    variant("Member", "AT"),
    variant("Member", "EU", "70"),
    variant("Member", "WORLD", "80"),
    variant("Student", "AT", "40"),
    variant("Student", "EU", "50"),
    variant("Member Plus", "All regions", "120"),
  ];
  const groups = getGiftMembershipGroups(variants);
  assert.deepEqual(groups.map((group) => group.label), ["Member", "Student", "Member Plus"]);
  assert.deepEqual(groups.map((group) => group.variants.length), [3, 2, 1]);
  assert.deepEqual(groups[0].variants.map((entry) => entry.selectionLabel), ["AT", "EU", "WORLD"]);
  assert.equal(groups[0].variants[1].id, "Member-EU");
  assert.equal(groups[0].variants[1].price.amount, "70");
});

test("finds the membership option when Shopify returns region first", () => {
  const entry = variant("Member", "AT");
  entry.selectedOptions.reverse();
  const [group] = getGiftMembershipGroups([entry]);
  assert.equal(group.label, "Member");
  assert.equal(group.variants[0].selectionLabel, "AT");
});

test("supports original single-option gifts and unavailable regions", () => {
  const entry = variant("Student", "EU");
  entry.availableForSale = false;
  const groups = getGiftMembershipGroups([
    { id: "plus", title: "Member Plus", selectedOptions: [] },
    entry,
  ]);
  assert.equal(groups[0].label, "Member Plus");
  assert.equal(groups[1].variants[0].availableForSale, false);
  assert.deepEqual(getGiftMembershipGroups(), []);
});
