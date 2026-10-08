const SHOPIFY_ADMIN_API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || "2026-01";
const isDebugEnabled = process.env.DEBUG_SHOPIFY_SUBSCRIPTIONS === "1" || process.env.NODE_ENV !== "production";

const CUSTOMER_SUBSCRIPTIONS_QUERY = `
  query CustomerSubscriptions($customerId: ID!) {
    customer(id: $customerId) {
      id
      email
      tags
      subscriptionStatusMetafield: metafield(namespace: "custom", key: "subscription_status") {
        value
      }
      subscriptionTierMetafield: metafield(namespace: "custom", key: "subscription_tier") {
        value
      }
      subscriptionStartDateMetafield: metafield(namespace: "custom", key: "subscription_start_date") {
        value
      }
      subscriptionContracts(first: 20) {
        nodes {
          id
          status
          createdAt
          nextBillingDate
          lines(first: 10) {
            nodes {
              id
              title
              sellingPlanName
              sku
              productId
              variantId
            }
          }
        }
      }
    }
  }
`;

const CUSTOMER_SUBSCRIPTIONS_BY_EMAIL_QUERY = `
  query CustomerSubscriptionsByEmail($query: String!) {
    customers(first: 1, query: $query) {
      nodes {
        id
        email
        tags
        subscriptionStatusMetafield: metafield(namespace: "custom", key: "subscription_status") {
          value
        }
        subscriptionTierMetafield: metafield(namespace: "custom", key: "subscription_tier") {
          value
        }
        subscriptionStartDateMetafield: metafield(namespace: "custom", key: "subscription_start_date") {
          value
        }
        subscriptionContracts(first: 20) {
          nodes {
            id
            status
            createdAt
            nextBillingDate
            lines(first: 10) {
              nodes {
                id
                title
                sellingPlanName
                sku
                productId
                variantId
              }
            }
          }
        }
      }
    }
  }
`;

const SET_CUSTOMER_METAFIELDS_MUTATION = `
  mutation SetCustomerMetafields($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        key
        namespace
        value
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ADD_CUSTOMER_TAGS_MUTATION = `
  mutation AddCustomerTags($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      node {
        id
      }
      userErrors {
        field
        message
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

const getEnvPresence = () => {
  const domain = getShopDomain();
  return {
    hasShopDomain: Boolean(domain),
    hasShopifyStoreDomain: Boolean(process.env.SHOPIFY_STORE_DOMAIN),
    hasShopifyShop: Boolean(process.env.SHOPIFY_SHOP),
    hasClientId: Boolean(process.env.SHOPIFY_CLIENT_ID || process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID),
    hasClientSecret: Boolean(process.env.SHOPIFY_CLIENT_SECRET || process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET),
    hasStaticAdminToken: Boolean(
      process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN ||
        process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ||
        process.env.SHOPIFY_ACCESS_TOKEN,
    ),
    adminApiVersion: SHOPIFY_ADMIN_API_VERSION,
  };
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

const throwUserErrors = (errors = []) => {
  const messages = Array.isArray(errors) ? errors.map((error) => error?.message).filter(Boolean) : [];
  if (messages.length > 0) {
    throw new Error(messages.join("; "));
  }
};

const logShopifySubscriptionPayload = (data, debugBase) => {
  if (!isDebugEnabled) return;

  console.log("[shopifySubscriptions] raw customer subscription payload", {
    ...debugBase,
    customer: data?.customer || null,
  });
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

const getContractLines = (contract) =>
  Array.isArray(contract?.lines?.nodes)
    ? contract.lines.nodes.map((line) => ({
        id: line?.id || null,
        title: line?.title || null,
        sellingPlanName: line?.sellingPlanName || null,
        sku: line?.sku || null,
        productId: line?.productId || null,
        variantId: line?.variantId || null,
      }))
    : [];

const getSubscriptionNameFromContract = (contract) => {
  const firstLine = getContractLines(contract)[0] || null;
  return firstLine?.title || firstLine?.sellingPlanName || null;
};

const getIsMemberPlusFromContract = (contract) =>
  getContractLines(contract).some(
    (line) => isMemberPlusLabel(line?.title) || isMemberPlusLabel(line?.sellingPlanName) || isMemberPlusLabel(line?.sku),
  );

const inactiveSubscriptionDefaults = {
  hasActiveSubscription: false,
  subscriptionStatus: null,
  subscriptionName: null,
  subscriptionStartDate: null,
  nextBillingDate: null,
  contractId: null,
  subscriptionLines: [],
  isMemberPlus: false,
};

const toSubscriptionSummary = (contract) => {
  const subscriptionLines = getContractLines(contract);

  return {
    contractId: contract?.id || null,
    subscriptionStatus: contract?.status || null,
    subscriptionName: getSubscriptionNameFromContract(contract),
    subscriptionStartDate: contract?.createdAt || null,
    nextBillingDate: contract?.nextBillingDate || null,
    subscriptionLines,
    isMemberPlus: getIsMemberPlusFromContract(contract),
  };
};

const pickSubscriptionFromSignals = (customer) => {
  const tags = Array.isArray(customer?.tags) ? customer.tags : [];
  const statusFromMetafield = String(customer?.subscriptionStatusMetafield?.value || "")
    .trim()
    .toLowerCase();
  const tierFromMetafield = String(customer?.subscriptionTierMetafield?.value || "").trim();
  const startDateFromMetafield = String(customer?.subscriptionStartDateMetafield?.value || "").trim() || null;
  const normalizedTags = tags.map((tag) => String(tag || "").trim().toLowerCase());

  const statusTag = normalizedTags.find((tag) => tag === "subscription:active" || tag === "member:active");
  const tierTag = tags.find((tag) => String(tag || "").toLowerCase().startsWith("subscription_tier:")) || null;
  const isMemberPlusTag = tags.some((tag) => isMemberPlusLabel(tag));

  const isActive =
    statusFromMetafield === "active" ||
    statusFromMetafield === "true" ||
    Boolean(statusTag) ||
    Boolean(tierTag);

  const tierLabelFromTag = tierTag ? tierTag.split(":").slice(1).join(":").trim() : "";
  const tierLabel = tierFromMetafield || tierLabelFromTag || null;

  if (!isActive) return null;
  return {
    hasActiveSubscription: true,
    subscriptionStatus: "ACTIVE",
    subscriptionName: tierLabel,
    subscriptionStartDate: startDateFromMetafield,
    nextBillingDate: null,
    contractId: null,
    subscriptionLines: [],
    isMemberPlus: isMemberPlusLabel(tierLabel) || isMemberPlusTag,
  };
};

export async function getCustomerSubscriptionStatus(shopifyCustomerId) {
  const config = getAdminConfig();
  const debugBase = {
    customerIdInput: shopifyCustomerId || null,
    shopDomain: getShopDomain() || null,
    authMode: config?.authMode || "none",
    env: getEnvPresence(),
  };

  if (!shopifyCustomerId) {
    return {
      ...inactiveSubscriptionDefaults,
      debug: {
        ...debugBase,
        reason: "missing_customer_id",
      },
    };
  }

  try {
    if (!config) {
      return {
        ...inactiveSubscriptionDefaults,
        debug: {
          ...debugBase,
          reason: "missing_admin_config",
        },
      };
    }

    const data = await adminRequest(CUSTOMER_SUBSCRIPTIONS_QUERY, { customerId: shopifyCustomerId });
    logShopifySubscriptionPayload(data, debugBase);

    if (!data?.customer) {
      if (isDebugEnabled) {
        console.log("[shopifySubscriptions] no customer returned", debugBase);
      }
      return {
        ...inactiveSubscriptionDefaults,
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
      const signalFallback = pickSubscriptionFromSignals(data?.customer);

      if (isDebugEnabled) {
        console.log("[shopifySubscriptions] no active contract", {
          ...debugBase,
          customerIdResolved: data?.customer?.id || null,
          contractsFound: contracts.length,
          contractStatuses,
          customerTags: data?.customer?.tags || [],
          customSubscriptionStatus: data?.customer?.subscriptionStatusMetafield?.value || null,
          customSubscriptionTier: data?.customer?.subscriptionTierMetafield?.value || null,
          customSubscriptionStartDate: data?.customer?.subscriptionStartDateMetafield?.value || null,
          usedSignalFallback: Boolean(signalFallback),
        });
      }
      if (signalFallback) {
        return {
          ...signalFallback,
          debug: {
            ...debugBase,
            customerIdResolved: data?.customer?.id || null,
            contractsFound: contracts.length,
            contractStatuses,
            customerTags: data?.customer?.tags || [],
            customSubscriptionStatus: data?.customer?.subscriptionStatusMetafield?.value || null,
            customSubscriptionTier: data?.customer?.subscriptionTierMetafield?.value || null,
            customSubscriptionStartDate: data?.customer?.subscriptionStartDateMetafield?.value || null,
            note: "subscription_contracts not visible; fallback from customer tags/metafields applied",
            reason: "active_subscription_from_customer_signals",
          },
        };
      }
      return {
        ...inactiveSubscriptionDefaults,
        debug: {
          ...debugBase,
          customerIdResolved: data?.customer?.id || null,
          contractsFound: contracts.length,
          contractStatuses,
          customerTags: data?.customer?.tags || [],
          customSubscriptionStatus: data?.customer?.subscriptionStatusMetafield?.value || null,
          customSubscriptionTier: data?.customer?.subscriptionTierMetafield?.value || null,
          customSubscriptionStartDate: data?.customer?.subscriptionStartDateMetafield?.value || null,
          note: "subscription_contracts may be hidden when owned by another app (e.g. Shopify Subscriptions app)",
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
      ...inactiveSubscriptionDefaults,
      debug: {
        ...debugBase,
        reason: "exception",
        error: error instanceof Error ? error.message : "unknown_error",
      },
    };
  }
}

const getSubscriptionStatusFromCustomer = (customer, debugBase) => {
  if (!customer) {
    return {
      ...inactiveSubscriptionDefaults,
      debug: {
        ...debugBase,
        reason: "no_customer",
      },
    };
  }

  const contracts = Array.isArray(customer.subscriptionContracts?.nodes) ? customer.subscriptionContracts.nodes : [];
  const contractStatuses = contracts.map((contract) => String(contract?.status || "UNKNOWN"));
  const activeContract =
    contracts.find((contract) => String(contract?.status || "").toUpperCase() === "ACTIVE") || null;

  if (activeContract) {
    const summary = toSubscriptionSummary(activeContract);
    return {
      hasActiveSubscription: true,
      ...summary,
      debug: {
        ...debugBase,
        customerIdResolved: customer?.id || null,
        contractsFound: contracts.length,
        contractStatuses,
        reason: "active_contract_found",
      },
    };
  }

  const signalFallback = pickSubscriptionFromSignals(customer);
  if (signalFallback) {
    return {
      ...signalFallback,
      debug: {
        ...debugBase,
        customerIdResolved: customer?.id || null,
        contractsFound: contracts.length,
        contractStatuses,
        customerTags: customer?.tags || [],
        customSubscriptionStatus: customer?.subscriptionStatusMetafield?.value || null,
        customSubscriptionTier: customer?.subscriptionTierMetafield?.value || null,
        customSubscriptionStartDate: customer?.subscriptionStartDateMetafield?.value || null,
        reason: "active_subscription_from_customer_signals",
      },
    };
  }

  return {
    ...inactiveSubscriptionDefaults,
    debug: {
      ...debugBase,
      customerIdResolved: customer?.id || null,
      contractsFound: contracts.length,
      contractStatuses,
      customerTags: customer?.tags || [],
      customSubscriptionStatus: customer?.subscriptionStatusMetafield?.value || null,
      customSubscriptionTier: customer?.subscriptionTierMetafield?.value || null,
      customSubscriptionStartDate: customer?.subscriptionStartDateMetafield?.value || null,
      reason: "no_active_contract",
    },
  };
};

export async function getCustomerSubscriptionStatusByEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const config = getAdminConfig();
  const debugBase = {
    customerEmailInput: normalizedEmail || null,
    shopDomain: getShopDomain() || null,
    authMode: config?.authMode || "none",
    env: getEnvPresence(),
  };

  if (!normalizedEmail) {
    return {
      ...inactiveSubscriptionDefaults,
      debug: {
        ...debugBase,
        reason: "missing_customer_email",
      },
    };
  }

  try {
    if (!config) {
      return {
        ...inactiveSubscriptionDefaults,
        debug: {
          ...debugBase,
          reason: "missing_admin_config",
        },
      };
    }

    const data = await adminRequest(CUSTOMER_SUBSCRIPTIONS_BY_EMAIL_QUERY, {
      query: `email:${normalizedEmail}`,
    });
    const customer = Array.isArray(data?.customers?.nodes) ? data.customers.nodes[0] : null;

    return getSubscriptionStatusFromCustomer(customer, debugBase);
  } catch (error) {
    console.error("Failed to resolve Shopify subscription status by email:", error);
    return {
      ...inactiveSubscriptionDefaults,
      debug: {
        ...debugBase,
        reason: "exception",
        error: error instanceof Error ? error.message : "unknown_error",
      },
    };
  }
}

export async function mirrorGiftMembershipToShopifyCustomer({
  shopifyCustomerId,
  tier,
  startsAt,
  endsAt,
  giftId,
  orderId,
}) {
  if (!shopifyCustomerId) return { ok: false, reason: "missing_customer_id" };

  const metafields = [
    {
      ownerId: shopifyCustomerId,
      namespace: "custom",
      key: "gift_membership_status",
      type: "single_line_text_field",
      value: "active",
    },
    {
      ownerId: shopifyCustomerId,
      namespace: "custom",
      key: "gift_membership_tier",
      type: "single_line_text_field",
      value: String(tier || ""),
    },
    {
      ownerId: shopifyCustomerId,
      namespace: "custom",
      key: "gift_membership_starts_at",
      type: "date_time",
      value: startsAt,
    },
    {
      ownerId: shopifyCustomerId,
      namespace: "custom",
      key: "gift_membership_ends_at",
      type: "date_time",
      value: endsAt,
    },
    {
      ownerId: shopifyCustomerId,
      namespace: "custom",
      key: "gift_membership_source_gift_id",
      type: "single_line_text_field",
      value: String(giftId || ""),
    },
    {
      ownerId: shopifyCustomerId,
      namespace: "custom",
      key: "gift_membership_source_order_id",
      type: "single_line_text_field",
      value: String(orderId || ""),
    },
  ];

  const metafieldData = await adminRequest(SET_CUSTOMER_METAFIELDS_MUTATION, { metafields });
  if (!metafieldData?.metafieldsSet) {
    throw new Error("Shopify Admin API did not return a metafieldsSet response.");
  }
  throwUserErrors(metafieldData?.metafieldsSet?.userErrors);

  const normalizedTier = String(tier || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const tags = ["gift-membership-active", normalizedTier ? `gift-membership-tier:${normalizedTier}` : null].filter(Boolean);
  const tagData = await adminRequest(ADD_CUSTOMER_TAGS_MUTATION, { id: shopifyCustomerId, tags });
  if (!tagData?.tagsAdd) {
    throw new Error("Shopify Admin API did not return a tagsAdd response.");
  }
  throwUserErrors(tagData?.tagsAdd?.userErrors);

  return { ok: true };
}
