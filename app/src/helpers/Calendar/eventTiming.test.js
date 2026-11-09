import assert from "node:assert/strict";
import test from "node:test";
import { isPineaEventArchived, isPineaEventCurrent } from "./eventTiming.js";

const hosted = (endDate) => ({ endDate, highlight: { hosted: true } });

test("hosted events archive immediately after their explicit end time", () => {
  const event = hosted("2026-11-06T10:00:00Z");
  assert.equal(isPineaEventCurrent(event, new Date("2026-11-06T09:59:59Z")), true);
  assert.equal(isPineaEventArchived(event, new Date("2026-11-06T10:00:01Z")), true);
  assert.equal(isPineaEventCurrent(event, new Date("2026-11-06T10:00:01Z")), false);
});

test("date-only hosted events remain current through their final day", () => {
  const event = hosted("2026-11-06");
  assert.equal(isPineaEventCurrent(event, new Date(2026, 10, 6, 23, 59, 59, 999)), true);
  assert.equal(isPineaEventArchived(event, new Date(2026, 10, 7)), true);
});

test("hosted events use their start date if no end date exists", () => {
  const event = { startDate: "2026-11-06", highlight: { hosted: true } };
  assert.equal(isPineaEventCurrent(event, new Date(2026, 10, 6, 12)), true);
  assert.equal(isPineaEventArchived(event, new Date(2026, 10, 7)), true);
});

test("pinned-only events keep their previous two-day archive rule", () => {
  const event = { endDate: "2026-11-06", highlight: { pinned: true } };
  assert.equal(isPineaEventArchived(event, new Date(2026, 10, 7, 12)), false);
  assert.equal(isPineaEventArchived(event, new Date(2026, 10, 8)), true);
});

test("missing or invalid hosted dates do not archive prematurely", () => {
  for (const value of [undefined, "invalid"]) {
    assert.equal(isPineaEventArchived(hosted(value)), false);
    assert.equal(isPineaEventCurrent(hosted(value)), true);
  }
});
