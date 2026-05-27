const SHOPIFY_ADMIN_API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || "2026-01";
const SHOPIFY_CUSTOMER_API_URL = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL || "";

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

const CUSTOMER_ACCOUNT_SUBSCRIPTIONS_QUERY = `
  query CustomerAccountSubscriptions {
    customer {
      id
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

const getAdminConfig = () => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token =
    process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN ||
    process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ||
    process.env.SHOPIFY_ACCESS_TOKEN;

  if (!domain || !token) return null;
  return { domain, token };
};

const adminRequest = async (query, variables = {}) => {
  const config = getAdminConfig();
  if (!config) return null;

  const endpoint = `https://${config.domain}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": config.token,
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

const customerAccountRequest = async (query, accessToken, variables = {}) => {
  if (!SHOPIFY_CUSTOMER_API_URL || !accessToken) return null;

  const response = await fetch(SHOPIFY_CUSTOMER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
      "User-Agent": "pinea-customer-auth",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`Shopify Customer API request failed (${response.status}).`);
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

export async function getCustomerSubscriptionStatus({ shopifyCustomerId, customerAccessToken } = {}) {
  if (!shopifyCustomerId && !customerAccessToken) {
    return {
      hasActiveSubscription: false,
      subscriptionStatus: null,
      subscriptionName: null,
      nextBillingDate: null,
      contractId: null,
    };
  }

  try {
    // Prefer Customer Account API when we have a logged-in customer token.
    // This avoids requiring a separate Admin API token for profile subscription checks.
    let contracts = [];
    if (customerAccessToken) {
      const customerData = await customerAccountRequest(CUSTOMER_ACCOUNT_SUBSCRIPTIONS_QUERY, customerAccessToken);
      contracts = Array.isArray(customerData?.customer?.subscriptionContracts?.nodes)
        ? customerData.customer.subscriptionContracts.nodes
        : [];
    } else if (shopifyCustomerId) {
      const adminData = await adminRequest(CUSTOMER_SUBSCRIPTIONS_QUERY, { customerId: shopifyCustomerId });
      contracts = Array.isArray(adminData?.customer?.subscriptionContracts?.nodes)
        ? adminData.customer.subscriptionContracts.nodes
        : [];
    }

    if (!contracts.length) {
      return {
        hasActiveSubscription: false,
        subscriptionStatus: null,
        subscriptionName: null,
        nextBillingDate: null,
        contractId: null,
      };
    }

    const activeContract =
      contracts.find((contract) => String(contract?.status || "").toUpperCase() === "ACTIVE") || null;

    if (!activeContract) {
      return {
        hasActiveSubscription: false,
        subscriptionStatus: null,
        subscriptionName: null,
        nextBillingDate: null,
        contractId: null,
      };
    }

    const summary = toSubscriptionSummary(activeContract);
    return {
      hasActiveSubscription: true,
      ...summary,
    };
  } catch (error) {
    console.error("Failed to resolve Shopify subscription status:", error);
    return {
      hasActiveSubscription: false,
      subscriptionStatus: null,
      subscriptionName: null,
      nextBillingDate: null,
      contractId: null,
    };
  }
}
