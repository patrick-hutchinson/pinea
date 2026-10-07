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
          lines(first: 10) {
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
  scopes: process.env.SHOPIFY_CUSTOMER_ACCOUNT_SCOPES || "openid email",
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

const customerAccountRequest = async ({ apiUrl, accessToken, origin, query, variables }) => {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
      Origin: origin,
      "User-Agent": "pinea-customer-auth",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok || payload?.errors?.length) {
    const first = payload?.errors?.[0]?.message;
    throw new Error(first || "Failed to fetch Shopify Customer Account data.");
  }

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
  return firstLine?.variantTitle || firstLine?.title || firstLine?.sku || null;
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

export async function fetchCustomerSubscriptionStatus({ apiUrl, accessToken, origin }) {
  const debugBase = {
    source: "customer_account_api",
  };

  try {
    let after = null;
    const contracts = [];

    do {
      const data = await customerAccountRequest({
        apiUrl,
        accessToken,
        origin,
        query: CUSTOMER_MEMBERSHIPS_QUERY,
        variables: { after },
      });

      const connection = data?.customer?.subscriptionContracts || null;
      if (Array.isArray(connection?.nodes)) {
        contracts.push(...connection.nodes);
      }

      after = connection?.pageInfo?.hasNextPage ? connection?.pageInfo?.endCursor || null : null;
    } while (after);

    const contractStatuses = contracts.map((contract) => String(contract?.status || "UNKNOWN"));
    const activeContract =
      contracts.find((contract) => String(contract?.status || "").toUpperCase() === "ACTIVE") || null;

    if (!activeContract) {
      return {
        hasActiveSubscription: false,
        subscriptionStatus: null,
        subscriptionName: null,
        subscriptionStartDate: null,
        nextBillingDate: null,
        contractId: null,
        subscriptionLines: [],
        isMemberPlus: false,
        subscriptionSource: "customer_account_api",
        debug: {
          ...debugBase,
          contractsFound: contracts.length,
          contractStatuses,
          reason: "customer_account_no_active_contract",
        },
      };
    }

    return {
      hasActiveSubscription: true,
      subscriptionStatus: activeContract?.status || null,
      subscriptionName: getSubscriptionNameFromCustomerContract(activeContract),
      subscriptionStartDate: activeContract?.createdAt || null,
      nextBillingDate: activeContract?.nextBillingDate || null,
      contractId: activeContract?.id || null,
      subscriptionLines: getCustomerContractLines(activeContract),
      isMemberPlus: getIsMemberPlusFromCustomerContract(activeContract),
      subscriptionSource: "customer_account_api",
      debug: {
        ...debugBase,
        contractsFound: contracts.length,
        contractStatuses,
        activeContractId: activeContract?.id || null,
        reason: "customer_account_active_contract_found",
      },
    };
  } catch (error) {
    return {
      hasActiveSubscription: false,
      subscriptionStatus: null,
      subscriptionName: null,
      subscriptionStartDate: null,
      nextBillingDate: null,
      contractId: null,
      subscriptionLines: [],
      isMemberPlus: false,
      subscriptionSource: "customer_account_api",
      debug: {
        ...debugBase,
        reason: "customer_account_exception",
        error: error instanceof Error ? error.message : "unknown_error",
      },
    };
  }
}
