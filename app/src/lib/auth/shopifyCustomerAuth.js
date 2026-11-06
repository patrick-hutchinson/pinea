const CUSTOMER_PROFILE_QUERY = `
  query CustomerProfile {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
    }
  }
`;

const CUSTOMER_MEMBERSHIPS_QUERY = `
  query CustomerMemberships($after: String) {
    customer {
      id
      subscriptionContracts(first: 20, after: $after) {
        nodes {
          id
          status
          createdAt
          nextBillingDate
          lines(first: 250) {
            nodes {
              title
              variantTitle
              sku
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

const getRedirectUri = (request) => {
  if (process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI) {
    return process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI;
  }

  const url = new URL(request.url);
  return `${url.origin}/api/auth/shopify/callback`;
};

export const CUSTOMER_ACCOUNT_OAUTH_SCOPES = 'openid email customer-account-api:full';
export const CUSTOMER_CONTRACT_ACCESS_SCOPE = 'customer_write_subscription_contracts';

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing ${key} environment variable.`);
  return value;
};

export const getShopifyAuthConfig = (request) => ({
  clientId: requireEnv("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID"),
  authorizeUrl: requireEnv("SHOPIFY_CUSTOMER_ACCOUNT_AUTHORIZE_URL"),
  tokenUrl: requireEnv("SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_URL"),
  apiUrl: requireEnv("SHOPIFY_CUSTOMER_ACCOUNT_API_URL"),
  scopes: [...new Set(`${process.env.SHOPIFY_CUSTOMER_ACCOUNT_SCOPES || ''} ${CUSTOMER_ACCOUNT_OAUTH_SCOPES}`.trim().split(/\s+/))].join(' '),
  redirectUri: getRedirectUri(request),
  clientSecret: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET || null,
});

const parseJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  } catch {
    return null;
  }
};

export class CustomerAccountApiError extends Error {
  constructor(message, details = {}) { super(message); this.name = "CustomerAccountApiError"; this.details = details; }
}

const customerAccountRequest = async ({ apiUrl, accessToken, origin, query, variables, onResponse }) => {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json", Authorization: accessToken, Origin: origin, "User-Agent": "pinea-customer-auth"},
    body: JSON.stringify({query, variables}), cache: "no-store", signal: AbortSignal.timeout(15_000),
  });
  let payload;
  try { payload = await response.json(); }
  catch {
    const details = {httpStatus: response.status, requestId: response.headers.get('x-request-id'), responseFormat: 'non_json'};
    onResponse?.(details);
    throw new CustomerAccountApiError('Customer Account API returned a non-JSON response', details);
  }
  const errors = Array.isArray(payload?.errors) ? payload.errors.map((error) => ({
    message: String(error.message || '').replaceAll(accessToken, '[redacted]'),
    path: error.path || null, code: error.extensions?.code || null,
  })) : [];
  const details = {httpStatus: response.status, requestId: response.headers.get('x-request-id'), data: payload?.data ?? null, errors};
  onResponse?.(details);
  if (!response.ok || errors.length) throw new CustomerAccountApiError(errors[0]?.message || 'Customer Account API request failed', details);
  return payload?.data || null;
};

const normalizeMembershipLabel = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/p\.?\s*i\.?\s*n\.?\s*e\.?\s*a\.?/g, "pinea")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const isMemberPlusLabel = (value) => {
  const label = normalizeMembershipLabel(value);
  return label.includes("member plus") || label.includes("membership plus") || label.includes("plus");
};

const getCustomerContractLines = (contract) =>
  Array.isArray(contract?.lines?.nodes)
    ? contract.lines.nodes.map((line) => ({
        title: line?.title || null,
        variantTitle: line?.variantTitle || null,
        sku: line?.sku || null,
      }))
    : [];

const getSubscriptionNameFromCustomerContract = (contract) => {
  const firstLine = getCustomerContractLines(contract)[0] || null;
  return firstLine?.title || firstLine?.variantTitle || firstLine?.sku || null;
};

const getIsMemberPlusFromCustomerContract = (contract) =>
  getCustomerContractLines(contract).some(
    (line) => isMemberPlusLabel(line?.title) || isMemberPlusLabel(line?.variantTitle) || isMemberPlusLabel(line?.sku),
  );

export async function exchangeCodeForToken({ tokenUrl, clientId, clientSecret, code, codeVerifier, redirectUri }) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    code_verifier: codeVerifier,
    redirect_uri: redirectUri,
  });

  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  if (clientSecret) {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    headers.Authorization = `Basic ${credentials}`;
  }

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers,
    body: body.toString(),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok) {
    const message = payload?.error_description || payload?.error || "Failed to exchange authorization code.";
    throw new Error(message);
  }

  return payload;
}

export async function fetchCustomerProfile({ apiUrl, accessToken, idToken, origin }) {
  const data = await customerAccountRequest({ apiUrl, accessToken, origin, query: CUSTOMER_PROFILE_QUERY });
  const customer = data?.customer || null;
  const jwt = parseJwtPayload(idToken);

  const firstName = customer?.firstName || "";
  const lastName = customer?.lastName || "";
  const name = `${firstName} ${lastName}`.trim() || jwt?.name || "";
  const email = customer?.emailAddress?.emailAddress || jwt?.email || null;
  const shopifyCustomerId = customer?.id || jwt?.sub || null;

  if (!email) {
    throw new Error("Customer profile did not contain an email address.");
  }

  return {
    name,
    email,
    shopifyCustomerId,
  };
}

export const unavailableCustomerMembership = (reason, details = {}) => ({
  hasActiveSubscription: false, subscriptionVerification: 'unavailable', subscriptionStatus: null,
  subscriptionName: null, subscriptionStartDate: null, nextBillingDate: null, contractId: null,
  subscriptionCancelled: false, membershipAccessEndsAt: null,
  subscriptionLines: [], isMemberPlus: false, subscriptionSource: 'customer_account_api',
  subscriptionCheckedAt: new Date().toISOString(),
  debug: {source: 'customer_account_api', reason, ...details},
});

export async function refreshCustomerAccessToken({tokenUrl, clientId, clientSecret, refreshToken}) {
  const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
  if (clientSecret) headers.Authorization = 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64');
  const response = await fetch(tokenUrl, {
    method: 'POST', headers,
    body: new URLSearchParams({grant_type: 'refresh_token', client_id: clientId, refresh_token: refreshToken}),
    cache: 'no-store', signal: AbortSignal.timeout(15_000),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error('Customer token refresh failed; please sign in again.');
  return payload;
}

const CUSTOMER_CONTRACT_LINES_QUERY = `
  query CustomerContractLines($id: ID!, $after: String) {
    customer {
      id
      subscriptionContract(id: $id) {
        id
        lines(first: 250, after: $after) {
          nodes { title variantTitle sku }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
  }
`;

const CUSTOMER_BILLING_CYCLE_QUERY = `
  query CustomerUpcomingBillingCycle($id: ID!) {
    customer {
      id
      subscriptionContract(id: $id) {
        id
        upcomingBillingCycles(first: 1) {
          nodes { cycleIndex billingAttemptExpectedDate edited skipped }
        }
      }
    }
  }
`;

const CUSTOMER_CANCELLED_TERM_QUERY = `
  query CustomerCancelledTerm($id: ID!) {
    customer {
      id
      subscriptionContract(id: $id) {
        id
        orders(first: 1, reverse: true) { nodes { id processedAt financialStatus cancelledAt } }
      }
    }
  }
`;

export async function fetchCustomerSubscriptionStatus({apiUrl, accessToken, origin, expectedCustomerId, grantedScopes, now = Date.now()}) {
  const apiResponses = [];
  const contracts = [];
  let customerId = null;
  const onResponse = (response) => apiResponses.push(structuredClone(response));
  const assertCustomer = (data) => {
    const id = data?.customer?.id;
    if (!id || (expectedCustomerId && id !== expectedCustomerId) || (customerId && id !== customerId)) {
      throw new Error('Customer Account API customer does not match the authenticated session');
    }
    customerId = id;
  };
  const readConnection = (connection) => {
    if (!Array.isArray(connection?.nodes) || typeof connection?.pageInfo?.hasNextPage !== 'boolean') {
      throw new Error('Customer Account API returned an incomplete connection');
    }
    if (connection.pageInfo.hasNextPage && !connection.pageInfo.endCursor) throw new Error('Customer Account API returned an incomplete pagination cursor');
    return connection;
  };
  try {
    if (!accessToken) return unavailableCustomerMembership('customer_access_token_missing');
    let after = null;
    const seen = new Set();
    do {
      const data = await customerAccountRequest({apiUrl, accessToken, origin, query: CUSTOMER_MEMBERSHIPS_QUERY, variables: {after}, onResponse});
      assertCustomer(data);
      const connection = readConnection(data.customer.subscriptionContracts);
      contracts.push(...connection.nodes);
      after = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null;
      if (after && (seen.has(after) || seen.size >= 100)) throw new Error('Customer Account API contract pagination did not complete');
      if (after) seen.add(after);
    } while (after);

    if (contracts.some((contract) => !contract.createdAt || !Number.isFinite(Date.parse(contract.createdAt)))) {
      throw new Error('Cannot determine newest subscription contract: invalid creation date');
    }
    const newestContract = [...contracts].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) ||
      String(b.id).localeCompare(String(a.id), 'en', {numeric: true}))[0];
    for (const contract of newestContract ? [newestContract] : []) {
      let connection = readConnection(contract.lines);
      const lines = [...connection.nodes];
      const lineCursors = new Set();
      while (connection.pageInfo.hasNextPage) {
        const cursor = connection.pageInfo.endCursor;
        if (lineCursors.has(cursor) || lineCursors.size >= 100) throw new Error('Customer Account API line pagination did not complete');
        lineCursors.add(cursor);
        const data = await customerAccountRequest({apiUrl, accessToken, origin, query: CUSTOMER_CONTRACT_LINES_QUERY,
          variables: {id: contract.id, after: cursor}, onResponse});
        assertCustomer(data);
        if (data.customer.subscriptionContract?.id !== contract.id) throw new Error('Customer Account API returned the wrong contract');
        connection = readConnection(data.customer.subscriptionContract.lines);
        lines.push(...connection.nodes);
      }
      contract.lines = {nodes: lines};
    }
    const contractStatuses = contracts.map((contract) => String(contract.status || 'UNKNOWN'));
    const activeContract = newestContract?.status === 'ACTIVE' ? newestContract : null;
    const debug = {source: 'customer_account_api', customerId, contractsFound: contracts.length, contractStatuses,
      grantedOAuthScopes: grantedScopes || null, requiredHeadlessScope: CUSTOMER_CONTRACT_ACCESS_SCOPE,
      selectionPolicy: 'newest_contract_created_at',
      newestContract: newestContract ? {id: newestContract.id, createdAt: newestContract.createdAt, status: newestContract.status} : null,
      apiResponses, reason: activeContract ? 'customer_account_active_contract_found' : contracts.length ? 'customer_account_latest_contract_no_access' : 'customer_account_empty_contracts'};
    const base = {...unavailableCustomerMembership(debug.reason), subscriptionVerification: 'verified', debug};
    const candidates = [];
    let cancellationLookupFailed = false;
    debug.cancelledTerms = [];
    debug.requiredCancelledTermScope = 'customer_read_orders';
    for (const candidate of newestContract && ['ACTIVE', 'CANCELLED'].includes(newestContract.status) ? [newestContract] : []) {
      let upcomingBillingCycle = null;
      // Rescheduling a cycle can leave the contract-level nextBillingDate unchanged.
      // A cycle lookup failure must not revoke an ACTIVE contract's verified access.
      try {
        const data = await customerAccountRequest({apiUrl, accessToken, origin, query: CUSTOMER_BILLING_CYCLE_QUERY,
          variables: {id: candidate.id}, onResponse});
        assertCustomer(data);
        if (data.customer.subscriptionContract?.id !== candidate.id) throw new Error('Billing cycle contract mismatch');
        upcomingBillingCycle = data.customer.subscriptionContract.upcomingBillingCycles?.nodes?.[0] || null;
      } catch (error) {
        debug.billingCycleLookupError = String(error instanceof Error ? error.message : 'Billing cycle lookup failed')
          .replaceAll(accessToken || '[no-token]', '[redacted]');
      }
      const cycleDate = upcomingBillingCycle?.billingAttemptExpectedDate;
      const effectiveNextBillingDate = upcomingBillingCycle?.skipped === false && cycleDate && Number.isFinite(new Date(cycleDate).getTime())
        ? cycleDate : candidate.nextBillingDate || null;
      if (candidate.status === 'CANCELLED') {
        const term = {contractId: candidate.id, accessEndsAt: effectiveNextBillingDate,
          dateSource: upcomingBillingCycle?.skipped === false && cycleDate === effectiveNextBillingDate ? 'upcoming_billing_cycle' : 'contract_next_billing_date',
          reason: 'term_unverified'};
        debug.cancelledTerms.push(term);
        try {
          const data = await customerAccountRequest({apiUrl, accessToken, origin, query: CUSTOMER_CANCELLED_TERM_QUERY,
            variables: {id: candidate.id}, onResponse});
          assertCustomer(data);
          if (data.customer.subscriptionContract?.id !== candidate.id ||
              !Array.isArray(data.customer.subscriptionContract.orders?.nodes)) throw new Error('Cancelled contract term unavailable');
          const order = data.customer.subscriptionContract.orders.nodes[0];
          const paidAt = order?.processedAt ? Date.parse(order.processedAt) : NaN;
          const endsAt = effectiveNextBillingDate ? Date.parse(effectiveNextBillingDate) : NaN;
          if (!order || order.financialStatus !== 'PAID' || !Number.isFinite(paidAt) || paidAt > now) {
            term.reason = 'latest_order_not_paid'; continue;
          }
          if (!Number.isFinite(endsAt) || endsAt <= paidAt) {
            term.reason = 'missing_or_invalid_period_end'; cancellationLookupFailed = true; continue;
          }
          term.reason = endsAt > now ? 'paid_term_remaining' : 'paid_term_expired';
          if (endsAt <= now) continue;
        } catch (error) {
          term.reason = 'cancelled_term_lookup_failed';
          cancellationLookupFailed = true;
          term.error = String(error instanceof Error ? error.message : 'Cancelled term lookup failed').replaceAll(accessToken || '[no-token]', '[redacted]');
          continue;
        }
      }
      candidates.push({contract: candidate, effectiveNextBillingDate, upcomingBillingCycle});
    }
    // Never revive an older contract when the newest is expired, unpaid, or unverifiable.
    const selected = candidates[0];
    if (!selected) {
      if (cancellationLookupFailed) return {...base, subscriptionVerification: 'unavailable',
        debug: {...debug, reason: 'customer_account_cancellation_term_unavailable'}};
      return base;
    }
    const selectedContract = selected.contract;
    const cancelled = selectedContract.status === 'CANCELLED';
    debug.reason = cancelled ? 'customer_account_cancelled_paid_term_remaining' : 'customer_account_active_contract_found';
    debug.upcomingBillingCycle = selected.upcomingBillingCycle;
    return {...base, hasActiveSubscription: true, subscriptionStatus: selectedContract.status,
      subscriptionCancelled: cancelled, membershipAccessEndsAt: cancelled ? selected.effectiveNextBillingDate : null,
      subscriptionName: getSubscriptionNameFromCustomerContract(selectedContract), subscriptionStartDate: selectedContract.createdAt || null,
      nextBillingDate: selectedContract.nextBillingDate || null, contractId: selectedContract.id,
      effectiveNextBillingDate: selected.effectiveNextBillingDate,
      subscriptionLines: getCustomerContractLines(selectedContract), isMemberPlus: getIsMemberPlusFromCustomerContract(selectedContract)};
  } catch (error) {
    return unavailableCustomerMembership('customer_account_exception', {
      customerId, contractsFound: contracts.length, contractStatuses: contracts.map((contract) => String(contract.status || 'UNKNOWN')),
      grantedOAuthScopes: grantedScopes || null, requiredHeadlessScope: CUSTOMER_CONTRACT_ACCESS_SCOPE, apiResponses,
      httpStatus: error instanceof CustomerAccountApiError ? error.details.httpStatus : null,
      error: String(error instanceof Error ? error.message : 'Unknown Customer Account API error').replaceAll(accessToken || '[no-token]', '[redacted]'),
    });
  }
}
