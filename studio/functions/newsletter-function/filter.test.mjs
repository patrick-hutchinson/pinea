import {test} from 'node:test'
import assert from 'node:assert/strict'
import {parse, evaluate} from 'groq-js'
import defineBlueprint from '../../sanity.blueprint.mjs'

const blueprint = await defineBlueprint({})
const filter = parse(blueprint.resources[0].event.filter, {mode: 'delta'})
const document = {_id: 'membershipDiscount.test', _type: 'membershipDiscountNewsletter', couponCode: 'CLIENT-2027'}
const matches = async (before, after) => (await evaluate(filter, {before, after, root: after})).get()

test('publishing a private membership document triggers the function', async () => {
  assert.equal(await matches(null, document), true)
})
test('input edits and explicit retry requests trigger the function', async () => {
  assert.equal(await matches(document, {...document, couponCode: 'NEW-CODE'}), true)
  assert.equal(await matches(document, {...document, syncRequestedAt: 'now'}), true)
})
test('sync metadata writes cannot trigger a recursive sync', async () => {
  assert.equal(await matches(document, {...document, syncStatus: 'synced', syncLeaseToken: 'lock', checkoutUrl: 'https://example.com'}), false)
})
test('membership drafts and unprotected IDs never trigger the function', async () => {
  assert.equal(await matches(null, {...document, _id: 'drafts.membershipDiscount.test'}), false)
  assert.equal(await matches(null, {...document, _id: 'public-id'}), false)
})
test('ordinary newsletter routing is preserved', async () => {
  assert.equal(await matches(null, {_id: 'newsletter-test', _type: 'newsletter'}), true)
})
