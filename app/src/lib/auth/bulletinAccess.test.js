import assert from "node:assert/strict";
import test from "node:test";
import { MEMBERS_ONLY_PLACEHOLDERS, redactMembersOnlyBulletins } from "./bulletinAccess.js";

test("three distinct placeholders per language are between 100 and 140 characters", () => {
  assert.equal(MEMBERS_ONLY_PLACEHOLDERS.length, 3);
  for (const language of ["en", "de"]) {
    const texts = MEMBERS_ONLY_PLACEHOLDERS.map((item) => item[language]);
    assert.equal(new Set(texts).size, 3);
    for (const text of texts) assert.ok(text.length >= 100 && text.length <= 140, `${language}: ${text.length}`);
  }
});

const locked = {
  membersOnlyContent: true,
  teaser: [{ _key: "en", value: "PRIVATE_TEASER" }],
  text: [{ _key: "en", value: "PRIVATE_BODY" }],
  link: "https://example.com/private-link",
};

test("locked teaser, body and link never reach serialized props; placeholders cycle deterministically", () => {
  const items = [locked, { membersOnlyContent: false, teaser: "Public" }, locked, locked, locked];
  const output = redactMembersOnlyBulletins(items);
  assert.doesNotMatch(JSON.stringify(output), /PRIVATE_TEASER|PRIVATE_BODY|private-link/);
  assert.deepEqual(output, redactMembersOnlyBulletins(items));
  assert.equal(output[1].teaser, "Public");
  assert.equal(output[1].isMembersOnlyLocked, false);
  assert.deepEqual(output[0].teaser, output[4].teaser);
  assert.notDeepEqual(output[0].teaser, output[2].teaser);
  assert.notDeepEqual(output[2].teaser, output[3].teaser);
  assert.equal(locked.text[0].value, "PRIVATE_BODY");
});

test("active members retain original content and links", () => {
  assert.deepEqual(redactMembersOnlyBulletins([locked], true), [{ ...locked, isMembersOnlyLocked: false }]);
  assert.deepEqual(redactMembersOnlyBulletins(null), []);
});
