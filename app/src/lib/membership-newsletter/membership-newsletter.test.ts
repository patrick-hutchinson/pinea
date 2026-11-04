import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderMembershipDiscount, type DiscountDocument} from './render.ts';
import {createListmonkClient, syncMembershipDraft, type ListmonkRequest} from './listmonk.ts';
import {verifyMembershipRedemptionToken} from '../membership-redemption.ts';

const doc: DiscountDocument = {_id: 'membershipDiscount.test', _rev: '1', _type: 'membershipDiscountNewsletter',
  title: 'Test member', recipientEmail: 'person@example.com', couponCode: 'CLIENT-2027',
  membershipTier: 'member', region: 'AT', language: 'de', subject: 'Your membership'};
const render = (overrides = {}, template = '{{name}} {{code}} {{checkoutUrl}}') =>
  renderMembershipDiscount({...doc, ...overrides}, template, 'https://preview.pinea-periodical.com', 'test-secret');

test('HTTP errors identify the failed operation without exposing emails, tokens or response bodies', async (context) => {
  const keys = ['LISTMONK_URL', 'LISTMONK_USER', 'LISTMONK_TOKEN'];
  const previous = keys.map((key) => process.env[key]);
  context.after(() => keys.forEach((key, i) => {
    if (previous[i] === undefined) delete process.env[key]; else process.env[key] = previous[i];
  }));
  process.env.LISTMONK_URL = 'https://listmonk.example.com';
  process.env.LISTMONK_USER = 'test-user';
  process.env.LISTMONK_TOKEN = 'private-token';
  context.mock.method(globalThis, 'fetch', async () => new Response('Sensitive upstream details', {status: 403}));
  await assert.rejects(createListmonkClient()('/subscribers?query=person@example.com'), (error: Error) => {
    assert.equal(error.message, 'Listmonk Anfrage fehlgeschlagen (HTTP 403; GET /subscribers).');
    return true;
  });
});

test('all six membership options produce correctly signed redemption links', () => {
  for (const [membershipTier, region, variant] of [
    ['member', 'AT', '63963156873565'], ['member', 'EU', '63971059597661'],
    ['member', 'WORLD', '63971059630429'], ['student', 'AT', '63971055567197'],
    ['student', 'EU', '63971055599965'], ['plus', undefined, '63963164475741'],
  ]) {
    const mail = render({membershipTier, region});
    const token = new URL(mail.checkoutUrl).searchParams.get('token')!;
    assert.deepEqual(verifyMembershipRedemptionToken(token, 'test-secret'), {
      email: doc.recipientEmail, code: 'CLIENT-2027', variantId: `gid://shopify/ProductVariant/${variant}`,
      sellingPlanId: 'gid://shopify/SellingPlan/690977046877',
    });
    assert.equal(verifyMembershipRedemptionToken(token, 'wrong-secret'), null);
  }
});

test('rejects public document IDs, invalid recipient, invalid code and unavailable combinations', () => {
  for (const overrides of [{_id: 'public-id'}, {_id: 'drafts.membershipDiscount.test'},
    {recipientEmail: 'invalid'}, {couponCode: '<bad>'}, {membershipTier: 'student', region: 'WORLD'}]) {
    assert.throws(() => render(overrides));
  }
});

test('escapes HTML and Listmonk template expressions from optional recipient names', () => {
  const mail = render({recipientName: '<b>{{ .Subscriber.Email }}</b>'});
  assert.ok(mail.html.includes('&lt;b&gt;&#123;&#123; .Subscriber.Email &#125;&#125;&lt;/b&gt;'));
  assert.ok(!mail.html.includes('{{'));
});

test('both existing full templates render without the migration batch fixed date', () => {
  for (const language of ['de', 'en']) {
    const file = language === 'de' ? 'mail.html' : 'mail.en.html';
    const template = readFileSync(new URL(`../../app/scripts/send-codes/${file}`, import.meta.url), 'utf8');
    const mail = render({language}, template);
    assert.ok(mail.html.includes('CLIENT-2027'));
    assert.ok(mail.html.includes('/api/membership/redeem?token='));
    assert.ok(!mail.html.includes('{{checkoutUrl}}'));
    assert.ok(!mail.html.includes('01.01.2027'));
    assert.ok(!mail.html.includes('January 1, 2027'));
    assert.ok(mail.html.includes('@font-face'));
    assert.ok(mail.html.includes('https://www.pinea-periodical.com/fonts/HBMarginSWebv0.45-375.woff2'));
    assert.ok(mail.html.includes('font-family: "HBMarginS", "Helvetica Neue", "Segoe UI", Helvetica, sans-serif;'));
    assert.ok(mail.html.includes('mso-font-alt: "Helvetica"'));
    assert.ok(mail.html.includes("background-color: #ffffff; font-family: 'HBMarginS'"));
  }
});

function mockListmonk(options: {subscriberStatus?: string; campaignStatus?: string; unsubscribed?: boolean} = {}) {
  const calls: {path: string; method: string; body: any}[] = [];
  const lists: any[] = [];
  const campaigns: any[] = options.campaignStatus ? [{id: 50, name: render().stableName, status: options.campaignStatus}] : [];
  const templates: any[] = [];
  const subscribers: any[] = [{id: 7, email: doc.recipientEmail, status: options.subscriberStatus || 'enabled',
    lists: [{id: 99, subscription_status: 'confirmed'}]}];
  let memberIds: number[] = [];
  const request: ListmonkRequest = async (path, method = 'GET', body: any) => {
    calls.push({path, method, body});
    const url = new URL(path, 'https://test.invalid');
    if (method === 'GET' && url.pathname === '/campaigns') return {results: campaigns};
    if (method === 'GET' && url.pathname === '/lists') return {results: lists};
    if (method === 'GET' && url.pathname === '/templates') return templates;
    if (method === 'GET' && url.pathname === '/subscribers') return {results: url.searchParams.has('list_id')
      ? subscribers.filter((s) => memberIds.includes(s.id)) : subscribers};
    if (path === '/lists' && method === 'POST') {
      const list = {id: 20, ...body}; lists.push(list);
      if (options.unsubscribed) subscribers[0].lists.push({id: 20, subscription_status: 'unsubscribed'});
      return list;
    }
    if (path === '/templates' && method === 'POST') { const template = {id: 30, ...body}; templates.push(template); return template; }
    if (path === '/subscribers' && method === 'POST') { const s = {id: 8, ...body}; subscribers.push(s); return s; }
    if (path === '/subscribers/lists' && method === 'PUT') {
      assert.deepEqual(body.target_list_ids, [20]);
      memberIds = body.action === 'remove' ? memberIds.filter((id) => !body.ids.includes(id)) : [...new Set([...memberIds, ...body.ids])];
      return true;
    }
    if (path === '/campaigns' && method === 'POST') { const c = {id: 50, status: 'draft', ...body}; campaigns.push(c); return c; }
    if (path === '/campaigns/50' && method === 'PUT') { Object.assign(campaigns[0], body); return campaigns[0]; }
    throw new Error(`Unexpected API request: ${method} ${path}`);
  };
  return {request, calls, lists, campaigns, subscribers};
}

test('creates a one-recipient draft and retries without duplicate campaigns or marketing-list changes', async () => {
  const mock = mockListmonk();
  await syncMembershipDraft(mock.request, render());
  await syncMembershipDraft(mock.request, render());
  assert.equal(mock.lists.length, 1);
  assert.equal(mock.campaigns.length, 1);
  assert.deepEqual(mock.campaigns[0].lists, [20]);
  assert.equal(mock.campaigns[0].template_id, 30);
  assert.equal(mock.campaigns[0].status, 'draft');
  assert.equal(mock.lists[0].type, 'private');
  assert.deepEqual(mock.subscribers[0].lists, [{id: 99, subscription_status: 'confirmed'}]);
  assert.ok(!mock.calls.some(({path}) => /status|\/test|optin/.test(path)));
});

test('a changed recipient replaces only this document private list membership', async () => {
  const mock = mockListmonk();
  await syncMembershipDraft(mock.request, render());
  mock.subscribers.push({id: 8, email: 'second@example.com', status: 'enabled', lists: []});
  await syncMembershipDraft(mock.request, render({recipientEmail: 'second@example.com'}));
  assert.ok(mock.calls.some(({body}) => body?.action === 'remove' && body.ids[0] === 7));
  assert.equal(mock.campaigns.length, 1);
});

test('does not modify started campaigns or reactivate blocked/unsubscribed contacts', async () => {
  for (const options of [{campaignStatus: 'finished'}, {subscriberStatus: 'blocklisted'},
    {subscriberStatus: 'disabled'}, {unsubscribed: true}]) {
    const mock = mockListmonk(options);
    await assert.rejects(syncMembershipDraft(mock.request, render()));
    assert.ok(!mock.calls.some(({path, method}) => method === 'PUT' || (path === '/campaigns' && method === 'POST')));
  }
});
