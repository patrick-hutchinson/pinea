import assert from 'node:assert/strict';
import {test} from 'node:test';
import {addToCart, getCart, updateCartLine} from './shopify.js';
import {getLocalizedCartUrl, getShopifyLanguage} from '../helpers/shopifyLanguage.js';

const cartId = 'gid://shopify/Cart/test?key=private-key';
const cart = {id: cartId, checkoutUrl: 'https://test.myshopify.com/checkouts/test', lines: {nodes: []}};

function mockShopify(context, callback) {
  const keys = ['SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN'];
  const before = keys.map((key) => process.env[key]);
  process.env.SHOPIFY_STORE_DOMAIN = 'test.myshopify.com';
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = 'test-token';
  context.after(() => keys.forEach((key, index) => {
    if (before[index] === undefined) delete process.env[key];
    else process.env[key] = before[index];
  }));
  context.mock.method(globalThis, 'fetch', async (_url, options) => {
    assert.equal(options.cache, 'no-store');
    const body = JSON.parse(options.body);
    assert.match(body.query, /\$language: LanguageCode!/);
    assert.match(body.query, /@inContext\(language: \$language\)/);
    return Response.json({data: callback(body)});
  });
}

test('language is allowlisted and checkout links preserve the complete cart ID', () => {
  for (const language of ['en', 'EN']) assert.equal(getShopifyLanguage(language), 'EN');
  for (const language of ['de', 'DE', undefined, null, 'fr', ['en']]) assert.equal(getShopifyLanguage(language), 'DE');
  for (const language of ['de', 'en']) {
    const url = new URL(getLocalizedCartUrl(cartId, language, true), 'https://pinea.example');
    assert.equal(url.pathname, '/api/shopify/cart');
    assert.equal(url.searchParams.get('cartId'), cartId);
    assert.equal(url.searchParams.get('language'), language.toUpperCase());
    assert.equal(url.searchParams.get('checkout'), '1');
  }
});

test('new carts use the selected language and retain selling plans and recipient attributes', async (context) => {
  const attributes = [{key: 'Recipient email', value: 'recipient@example.com'}];
  mockShopify(context, ({variables}) => {
    assert.equal(variables.language, 'EN');
    assert.deepEqual(variables.lines, [{merchandiseId: 'variant', quantity: 1, sellingPlanId: 'plan', attributes}]);
    return {cartCreate: {cart, userErrors: []}};
  });
  assert.equal((await addToCart({merchandiseId: 'variant', sellingPlanId: 'plan',
    requiresSellingPlan: true, attributes, language: 'en'})).id, cartId);
});

test('existing carts can fetch checkout in a different language without being recreated', async (context) => {
  const seen = [];
  mockShopify(context, ({query, variables}) => {
    assert.match(query, /query GetCart/);
    assert.equal(variables.cartId, cartId);
    seen.push(variables.language);
    return {cart: {...cart, checkoutUrl: `${cart.checkoutUrl}?locale=${variables.language.toLowerCase()}`}};
  });
  assert.match((await getCart(cartId, 'de')).checkoutUrl, /locale=de/);
  assert.match((await getCart(cartId, 'en')).checkoutUrl, /locale=en/);
  assert.deepEqual(seen, ['DE', 'EN']);
});

test('add, update and remove operations all carry language context', async (context) => {
  const seen = [];
  mockShopify(context, ({query, variables}) => {
    assert.equal(variables.language, 'EN');
    assert.equal(variables.cartId, cartId);
    const field = query.includes('mutation AddCartLines') ? 'cartLinesAdd'
      : query.includes('mutation UpdateCartLines') ? 'cartLinesUpdate' : 'cartLinesRemove';
    seen.push(field);
    return {[field]: {cart, userErrors: []}};
  });
  await addToCart({cartId, merchandiseId: 'variant', language: 'en'});
  await updateCartLine({cartId, lineId: 'line', quantity: 2, language: 'en'});
  await updateCartLine({cartId, lineId: 'line', quantity: 0, language: 'en'});
  assert.deepEqual(seen, ['cartLinesAdd', 'cartLinesUpdate', 'cartLinesRemove']);
});
