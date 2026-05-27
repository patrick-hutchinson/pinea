const SHOPIFY_ADMIN_API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || "2026-01";
const isDebugEnabled = process.env.DEBUG_SHOPIFY_SUBSCRIPTIONS === "1" || process.env.NODE_ENV !== "production";

const CUSTOMER_SUBSCRIPTIONS_QUERY = `
  query CustomerSubscriptions($customerId: ID!) {
    customer(id: $customerId) {
      id
      email
      subscriptionContracts(first: 20) {
        nodes {
          id
          status
          nextBillingDate
          lines(first: 5) {
            nodes {
              productTitle
              variantTitle
            }
          }
        }
      }
    }
  }
`;

let cachedToken = null;
let cachedTokenExpiresAt = 0;

const getShopDomain = () => {
  const fromDomain = process.env.SHOPIFY_STORE_DOMAIN || "";
  if (fromDomain) return fromDomain;

  const fromShop = process.env.SHOPIFY_SHOP || "";
  if (!fromShop) return "";
  return fromShop.endsWith(".myshopify.com") ? fromShop : `${fromShop}.myshopify.com`;
};

const getAdminConfig = () => {
  const domain = getShopDomain();
  if (!domain) return null;

  // Preferred: Dev Dashboard client credentials flow (2026+).
  const clientId = process.env.SHOPIFY_CLIENT_ID || process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID || "";
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET || process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET || "";
  if (clientId && clientSecret) {
    return { domain, authMode: "client_credentials", clientId, clientSecret };
  }

  // Fallback: static admin token (legacy/custom-app setups).
  const token =
    process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN ||
    process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ||
    process.env.SHOPIFY_ACCESS_TOKEN;
  if (token) {
    return { domain, authMode: "static_token", token };
  }

  return null;
};

const getAdminAccessToken = async (config) => {
  if (!config) return null;
  if (config.authMode === "static_token") return config.token;

  if (cachedToken && Date.now() < cachedTokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const response = await fetch(`https://${config.domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok) {
    const reason = payload?.error_description || payload?.error || `HTTP ${response.status}`;
    throw new Error(`Shopify token exchange failed: ${reason}`);
  }

  cachedToken = payload?.access_token || null;
  const expiresIn = Number(payload?.expires_in) || 86399;
  cachedTokenExpiresAt = Date.now() + expiresIn * 1000;

  return cachedToken;
};

const adminRequest = async (query, variables = {}) => {
  const config = getAdminConfig();
  if (!config) return null;
  const accessToken = await getAdminAccessToken(config);
  if (!accessToken) return null;

  const endpoint = `https://${config.domain}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`Shopify Admin request failed (${response.status}).`);
  }
  if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
    throw new Error(payload.errors.map((error) => error?.message).filter(Boolean).join("; "));
  }

  return payload?.data || null;
};

const toSubscriptionSummary = (contract) => {
  const firstLine = contract?.lines?.nodes?.[0] || null;
  const productTitle = firstLine?.productTitle || "";
  const variantTitle = firstLine?.variantTitle || "";
  const composedName = [productTitle, variantTitle].filter(Boolean).join(" - ");

  return {
    contractId: contract?.id || null,
    subscriptionStatus: contract?.status || null,
    subscriptionName: composedName || productTitle || null,
    nextBillingDate: contract?.nextBillingDate || null,
  };
};

export async function getCustomerSubscriptionStatus(shopifyCustomerId) {
  const debugBase = {
    customerIdInput: shopifyCustomerId || null,
    shopDomain: getShopDomain() || null,
    authMode: getAdminConfig()?.authMode || "none",
  };

  if (!shopifyCustomerId) {
    return {
      hasActiveSubscription: false,
      subscriptionStatus: null,
      subscriptionName: null,
      nextBillingDate: null,
      contractId: null,
      debug: {
        ...debugBase,
        reason: "missing_customer_id",
      },
    };
  }

  try {
    const data = await adminRequest(CUSTOMER_SUBSCRIPTIONS_QUERY, { customerId: shopifyCustomerId });
    if (!data?.customer) {
      if (isDebugEnabled) {
        console.log("[shopifySubscriptions] no customer returned", debugBase);
      }
      return {
        hasActiveSubscription: false,
        subscriptionStatus: null,
        subscriptionName: null,
        nextBillingDate: null,
        contractId: null,
        debug: {
          ...debugBase,
          reason: "no_customer",
        },
      };
    }

    const contracts = Array.isArray(data.customer.subscriptionContracts?.nodes)
      ? data.customer.subscriptionContracts.nodes
      : [];
    const contractStatuses = contracts.map((contract) => String(contract?.status || "UNKNOWN"));

    const activeContract =
      contracts.find((contract) => String(contract?.status || "").toUpperCase() === "ACTIVE") || null;

    if (!activeContract) {
      if (isDebugEnabled) {
        console.log("[shopifySubscriptions] no active contract", {
          ...debugBase,
          customerIdResolved: data?.customer?.id || null,
          contractsFound: contracts.length,
          contractStatuses,
        });
      }
      return {
        hasActiveSubscription: false,
        subscriptionStatus: null,
        subscriptionName: null,
        nextBillingDate: null,
        contractId: null,
        debug: {
          ...debugBase,
          customerIdResolved: data?.customer?.id || null,
          contractsFound: contracts.length,
          contractStatuses,
          reason: "no_active_contract",
        },
      };
    }

    const summary = toSubscriptionSummary(activeContract);
    if (isDebugEnabled) {
      console.log("[shopifySubscriptions] active contract resolved", {
        ...debugBase,
        customerIdResolved: data?.customer?.id || null,
        contractsFound: contracts.length,
        contractStatuses,
        activeContractId: summary.contractId,
        activeSubscriptionName: summary.subscriptionName,
      });
    }
    return {
      hasActiveSubscription: true,
      ...summary,
      debug: {
        ...debugBase,
        customerIdResolved: data?.customer?.id || null,
        contractsFound: contracts.length,
        contractStatuses,
        reason: "active_contract_found",
      },
    };
  } catch (error) {
    console.error("Failed to resolve Shopify subscription status:", error);
    return {
      hasActiveSubscription: false,
      subscriptionStatus: null,
      subscriptionName: null,
      nextBillingDate: null,
      contractId: null,
      debug: {
        ...debugBase,
        reason: "exception",
        error: error instanceof Error ? error.message : "unknown_error",
      },
    };
  }
}
