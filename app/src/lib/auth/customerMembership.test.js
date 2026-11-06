import assert from 'node:assert/strict';
import {test} from 'node:test';
import {fetchCustomerSubscriptionStatus, getShopifyAuthConfig} from './shopifyCustomerAuth.js';
import {customerTokensFromResponse, encodeCustomerTokens, decodeCustomerTokens} from './customerTokens.js';
import {resolveCustomerMembership} from './customerMembership.js';
import {createSessionToken, decodeSessionToken} from './sessionCore.js';
import {getMembershipDisplayStartDate} from './memberAccess.js';

const customerId = 'gid://shopify/Customer/123';
const accessToken = 'shcat_TEST_SECRET';
const refreshToken = 'refresh_TEST_SECRET';
const apiUrl = 'https://shopify.com/123/account/customer/api/2026-01/graphql';
const origin = 'https://preview.pinea-periodical.com';
const identity = {sub: customerId, shopifyCustomerId: customerId, email: 'member@example.com', name: 'Test'};
const page = (nodes, after = null) => ({nodes, pageInfo: {hasNextPage: Boolean(after), endCursor: after}});
const contract = (status = 'ACTIVE', title = 'P.IN.E.A Member', id = 'gid://shopify/SubscriptionContract/1') => ({
  id, status, createdAt: '2026-07-18T00:00:00Z', nextBillingDate: '2027-07-18T00:00:00Z',
  lines: page([{title, variantTitle: 'EU', sku: 'MEMBER'}]),
});
const response = (contracts) => ({data: {customer: {id: customerId, subscriptionContracts: page(contracts)}}});
const args = {apiUrl, accessToken, origin, expectedCustomerId: customerId, grantedScopes: 'openid email customer-account-api:full'};
const credentials = () => customerTokensFromResponse({access_token: accessToken, expires_in: 3600,
  refresh_token: refreshToken, scope: args.grantedScopes}, customerId, 'client-id');

test('manual billing date reaches profile through the fresh membership resolver', async (context) => {
  env(context);
  const active = {...contract(), createdAt: '2026-11-04T00:00:00Z', nextBillingDate: '2027-07-14T00:00:00Z'};
  context.mock.method(globalThis, 'fetch', async () => Response.json(response([active])));
  const result = await resolveCustomerMembership({session: identity, credentials: credentials(), origin});
  assert.equal(result.subscriptionStartDate, active.createdAt);
  assert.equal(result.nextBillingDate, active.nextBillingDate);
  assert.equal(getMembershipDisplayStartDate(result), '2026-07-14T00:00:00.000Z');
});

function env(context) {
  const values = {AUTH_SESSION_SECRET: 'test-session-secret', SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID: 'client-id',
    SHOPIFY_CUSTOMER_ACCOUNT_AUTHORIZE_URL: 'https://shopify.com/auth/authorize',
    SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_URL: 'https://shopify.com/auth/token',
    SHOPIFY_CUSTOMER_ACCOUNT_API_URL: apiUrl, SHOPIFY_CUSTOMER_ACCOUNT_SCOPES: 'openid email'};
  const before = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]));
  Object.assign(process.env, values);
  context.after(() => {
    for (const [key, value] of Object.entries(before)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  });
}

test('OAuth always requests full Customer Account API access even with the old scope configuration', (context) => {
  env(context);
  assert.equal(getShopifyAuthConfig({url: origin}).scopes, 'openid email customer-account-api:full');
});

test('customer credentials are encrypted and authenticated, identity cookies contain no tokens or membership snapshot', (context) => {
  env(context);
  const tokens = credentials();
  const encoded = encodeCustomerTokens(tokens);
  assert.ok(!encoded.includes(accessToken));
  assert.ok(!encoded.includes(refreshToken));
  assert.deepEqual(decodeCustomerTokens(encoded), tokens);
  const pieces = encoded.split('.');
  pieces[3] = Buffer.from('modified ciphertext').toString('base64url');
  assert.equal(decodeCustomerTokens(pieces.join('.')), null);
  assert.equal(decodeCustomerTokens(encoded, tokens.sessionExpiresAt + 1), null);
  process.env.AUTH_SESSION_SECRET = 'different-secret';
  assert.equal(decodeCustomerTokens(encoded), null);
  const session = decodeSessionToken(createSessionToken({...identity, id: customerId, accessToken,
    refreshToken, hasActiveSubscription: true, isMemberPlus: true, contractId: 'stale'}));
  assert.equal(session.email, identity.email);
  assert.equal(session.accessToken, undefined);
  assert.equal(session.hasActiveSubscription, undefined);
  assert.equal(session.contractId, undefined);
});

test('ACTIVE grants access; cancellation without a paid term, paused, failed, expired and stale contracts deny it', async (context) => {
  let status = 'ACTIVE';
  let count = 0;
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, apiUrl);
    assert.equal(options.headers.Authorization, accessToken);
    assert.equal(options.cache, 'no-store');
    assert.equal(options.headers['X-Shopify-Access-Token'], undefined);
    assert.ok(JSON.parse(options.body).query.trim().startsWith('query'));
    count++;
    if (JSON.parse(options.body).query.includes('CustomerCancelledTerm')) return Response.json({data: {customer: {id: customerId,
      subscriptionContract: {id: contract().id, orders: {nodes: []}}}}});
    return Response.json(response([contract(status)]));
  });
  for (const current of ['ACTIVE', 'PAUSED', 'CANCELLED', 'FAILED', 'EXPIRED', 'STALE', 'UNKNOWN']) {
    status = current;
    const result = await fetchCustomerSubscriptionStatus(args);
    assert.equal(result.hasActiveSubscription, current === 'ACTIVE');
    assert.equal(result.subscriptionVerification, 'verified');
    assert.equal(result.subscriptionSource, 'customer_account_api');
    assert.equal(result.debug.contractStatuses[0], current);
  }
  assert.equal(count, 10);
});

test('all contract and line pages are read, and an active Plus contract wins over a regular active contract', async (context) => {
  const first = contract('ACTIVE');
  first.lines = page([{title: 'P.IN.E.A Member', variantTitle: 'EU'}], 'line-cursor');
  let calls = 0;
  context.mock.method(globalThis, 'fetch', async (_url, options) => {
    calls++;
    const {query, variables} = JSON.parse(options.body);
    if (query.includes('CustomerContractLines')) return Response.json({data: {customer: {id: customerId,
      subscriptionContract: {id: first.id, lines: page([{title: 'Additional line'}])}}}});
    return Response.json({data: {customer: {id: customerId, subscriptionContracts: variables.after
      ? page([contract('ACTIVE', 'P.IN.E.A Member Plus', 'gid://shopify/SubscriptionContract/2')])
      : page([first], 'contract-cursor')}}});
  });
  const result = await fetchCustomerSubscriptionStatus(args);
  assert.equal(result.isMemberPlus, true);
  assert.equal(result.contractId, 'gid://shopify/SubscriptionContract/2');
  assert.equal(result.debug.contractsFound, 2);
  assert.equal(calls, 4);
  // Keep the actual first response unmodified for diagnostics, even after merging line pages.
  assert.equal(result.debug.apiResponses[0].data.customer.subscriptionContracts.nodes[0].lines.nodes.length, 1);
});

test('rescheduled cycle date takes precedence without changing access or the raw contract date', async (context) => {
  let mode = 'edited';
  const active = {...contract(), nextBillingDate: '2027-11-04T16:00:00Z'};
  context.mock.method(globalThis, 'fetch', async (_url, options) => {
    const {query, variables} = JSON.parse(options.body);
    if (!query.includes('CustomerUpcomingBillingCycle')) return Response.json(response([active]));
    assert.equal(variables.id, active.id);
    if (mode === 'error') return Response.json({errors: [{message: 'Cycle access denied'}]}, {status: 403});
    return Response.json({data: {customer: {id: customerId, subscriptionContract: {id: active.id,
      upcomingBillingCycles: {nodes: mode === 'empty' ? [] : [{cycleIndex: 2, edited: true,
        skipped: mode === 'skipped', billingAttemptExpectedDate: '2027-07-14T16:00:00Z'}]}}}}});
  });
  for (mode of ['edited', 'skipped', 'empty', 'error']) {
    const result = await fetchCustomerSubscriptionStatus(args);
    assert.equal(result.hasActiveSubscription, true);
    assert.equal(result.subscriptionVerification, 'verified');
    assert.equal(result.nextBillingDate, active.nextBillingDate);
    assert.equal(result.effectiveNextBillingDate, mode === 'edited' ? '2027-07-14T16:00:00Z' : active.nextBillingDate);
    assert.equal(getMembershipDisplayStartDate(result), mode === 'edited' ? '2026-07-14T16:00:00.000Z' : '2026-11-04T16:00:00.000Z');
    if (mode === 'error') assert.match(result.debug.billingCycleLookupError, /denied/);
  }
});

test('cancelled paid contracts retain access only until the scheduled cycle end', async (context) => {
  const cancelled = {...contract('CANCELLED'), createdAt: '2026-11-04T00:00:00Z', nextBillingDate: '2027-11-04T00:00:00Z'};
  let financialStatus = 'PAID';
  let cancelledAt = null;
  context.mock.method(globalThis, 'fetch', async (_url, options) => {
    const {query} = JSON.parse(options.body);
    if (query.includes('CustomerUpcomingBillingCycle')) return Response.json({data: {customer: {id: customerId,
      subscriptionContract: {id: cancelled.id, upcomingBillingCycles: {nodes: [{skipped: false, billingAttemptExpectedDate: '2027-07-14T00:00:00Z'}]}}}}});
    if (query.includes('CustomerCancelledTerm')) return Response.json({data: {customer: {id: customerId,
      subscriptionContract: {id: cancelled.id, orders: {nodes: [{id: 'order', processedAt: '2026-11-04T00:00:00Z', financialStatus, cancelledAt}]}}}}});
    return Response.json(response([cancelled]));
  });
  const checked = (now) => fetchCustomerSubscriptionStatus({...args, now: Date.parse(now)});
  const current = await checked('2026-11-06T00:00:00Z');
  assert.equal(current.hasActiveSubscription, true);
  assert.equal(current.subscriptionStatus, 'CANCELLED');
  assert.equal(current.subscriptionCancelled, true);
  assert.equal(current.membershipAccessEndsAt, '2027-07-14T00:00:00Z');
  assert.equal(current.debug.cancelledTerms[0].reason, 'paid_term_remaining');
  assert.equal((await checked('2027-07-13T23:59:59Z')).hasActiveSubscription, true);
  assert.equal((await checked('2027-07-14T00:00:00Z')).hasActiveSubscription, false);
  assert.equal((await checked('2027-11-04T00:00:00Z')).hasActiveSubscription, false);
  for (financialStatus of ['PENDING', 'REFUNDED', 'PARTIALLY_REFUNDED', 'VOIDED']) {
    assert.equal((await checked('2026-11-06T00:00:00Z')).hasActiveSubscription, false);
  }
  financialStatus = 'PAID'; cancelledAt = '2026-11-05T00:00:00Z';
  assert.equal((await checked('2026-11-06T00:00:00Z')).hasActiveSubscription, false);
});

test('cancelled Plus retains tier benefits alongside active regular membership, and missing payment proof does not grant access', async (context) => {
  const plus = contract('CANCELLED', 'P.IN.E.A Member Plus', 'gid://shopify/SubscriptionContract/2');
  let failOrder = false;
  let includeActive = true;
  context.mock.method(globalThis, 'fetch', async (_url, options) => {
    const {query, variables} = JSON.parse(options.body);
    if (query.includes('CustomerUpcomingBillingCycle')) return Response.json({data: {customer: {id: customerId,
      subscriptionContract: {id: variables.id, upcomingBillingCycles: {nodes: []}}}}});
    if (query.includes('CustomerCancelledTerm')) {
      if (failOrder) return Response.json({errors: [{message: 'Access denied for orders', extensions: {code: 'ACCESS_DENIED'}}]});
      return Response.json({data: {customer: {id: customerId, subscriptionContract: {id: plus.id,
        orders: {nodes: [{id: 'order', processedAt: '2026-07-18T00:00:00Z', financialStatus: 'PAID', cancelledAt: null}]}}}}});
    }
    return Response.json(response([...(includeActive ? [contract()] : []), plus]));
  });
  const fetchStatus = () => fetchCustomerSubscriptionStatus({...args, now: Date.parse('2026-11-06T00:00:00Z')});
  assert.equal((await fetchStatus()).isMemberPlus, true);
  failOrder = true;
  const regular = await fetchStatus();
  assert.equal(regular.hasActiveSubscription, true);
  assert.equal(regular.isMemberPlus, false);
  assert.equal(regular.subscriptionStatus, 'ACTIVE');
  includeActive = false;
  const unknown = await fetchStatus();
  assert.equal(unknown.hasActiveSubscription, false);
  assert.equal(unknown.subscriptionVerification, 'unavailable');
  assert.equal(unknown.debug.reason, 'customer_account_cancellation_term_unavailable');
});

test('an empty connection is reported exactly, not replaced with Admin data or metafields', async (context) => {
  const payload = response([]);
  context.mock.method(globalThis, 'fetch', async () => Response.json(payload, {headers: {'x-request-id': 'request-123'}}));
  const result = await fetchCustomerSubscriptionStatus(args);
  assert.equal(result.hasActiveSubscription, false);
  assert.equal(result.debug.reason, 'customer_account_empty_contracts');
  assert.deepEqual(result.debug.apiResponses[0].data, payload.data);
  assert.equal(result.debug.apiResponses[0].requestId, 'request-123');
});

test('GraphQL access errors and HTTP status remain inspectable, but never grant access or expose tokens', async (context) => {
  context.mock.method(globalThis, 'fetch', async () => Response.json({data: {customer: null}, errors: [{
    message: `Access denied for subscriptionContracts ${accessToken}`, path: ['customer', 'subscriptionContracts'], extensions: {code: 'ACCESS_DENIED'},
  }]}, {status: 403}));
  const result = await fetchCustomerSubscriptionStatus(args);
  assert.equal(result.hasActiveSubscription, false);
  assert.equal(result.subscriptionVerification, 'unavailable');
  assert.equal(result.debug.httpStatus, 403);
  assert.equal(result.debug.apiResponses[0].errors[0].code, 'ACCESS_DENIED');
  assert.ok(!JSON.stringify(result).includes(accessToken));
});

test('mismatched customer identity and incomplete or looping pagination deny access', async (context) => {
  let payload = response([contract()]);
  context.mock.method(globalThis, 'fetch', async () => Response.json(payload));
  payload.data.customer.id = 'gid://shopify/Customer/999';
  assert.equal((await fetchCustomerSubscriptionStatus(args)).subscriptionVerification, 'unavailable');
  payload = response([contract()]);
  delete payload.data.customer.subscriptionContracts.pageInfo;
  assert.equal((await fetchCustomerSubscriptionStatus(args)).hasActiveSubscription, false);
  payload = {data: {customer: {id: customerId, subscriptionContracts: page([contract()], 'same-cursor')}}};
  assert.equal((await fetchCustomerSubscriptionStatus(args)).hasActiveSubscription, false);
});

test('a subsequent cancellation immediately overrides a stale active login cookie', async (context) => {
  env(context);
  let status = 'ACTIVE';
  let calls = 0;
  context.mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(url, apiUrl); calls++;
    return Response.json(response([contract(status)]));
  });
  const input = {session: {...identity, hasActiveSubscription: true, isMemberPlus: true}, credentials: credentials(), origin};
  assert.equal((await resolveCustomerMembership(input)).hasActiveSubscription, true);
  status = 'CANCELLED';
  const cancelled = await resolveCustomerMembership(input);
  assert.equal(cancelled.hasActiveSubscription, false);
  assert.equal(cancelled.isMemberPlus, false);
  assert.equal(cancelled.contractId, null);
  assert.equal(calls, 5);
  assert.ok(!JSON.stringify(cancelled).includes(accessToken));
  assert.ok(!JSON.stringify(cancelled).includes(refreshToken));
});

test('old sessions without credentials, wrong-customer credentials and expired non-refreshable tokens cannot grant access', async (context) => {
  env(context);
  context.mock.method(globalThis, 'fetch', async () => { throw new Error('No request should be made'); });
  const input = {session: {...identity, hasActiveSubscription: true}, origin};
  assert.equal((await resolveCustomerMembership(input)).needsReauthentication, true);
  assert.equal((await resolveCustomerMembership({...input, credentials: {...credentials(), customerId: 'gid://shopify/Customer/999'}})).hasActiveSubscription, false);
  const expired = {...credentials(), refreshToken: null, expiresAt: Date.now() - 1};
  const result = await resolveCustomerMembership({...input, credentials: expired});
  assert.equal(result.hasActiveSubscription, false);
  assert.equal(result.needsReauthentication, true);
});

test('expired access tokens refresh before a live check and rotated tokens stay out of public session data', async (context) => {
  env(context);
  let saved;
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    if (url.endsWith('/auth/token')) {
      assert.equal(options.body.get('grant_type'), 'refresh_token');
      assert.equal(options.body.get('refresh_token'), refreshToken);
      return Response.json({access_token: 'shcat_NEW_SECRET', refresh_token: 'refresh_NEW_SECRET', expires_in: 3600});
    }
    assert.equal(options.headers.Authorization, 'shcat_NEW_SECRET');
    return Response.json(response([contract()]));
  });
  const result = await resolveCustomerMembership({session: identity, credentials: {...credentials(), expiresAt: Date.now() - 1},
    origin, onTokensUpdated: (tokens) => { saved = tokens; }});
  assert.equal(result.hasActiveSubscription, true);
  assert.equal(saved.accessToken, 'shcat_NEW_SECRET');
  assert.equal(saved.refreshToken, 'refresh_NEW_SECRET');
  assert.ok(!JSON.stringify(result).includes('NEW_SECRET'));
});
