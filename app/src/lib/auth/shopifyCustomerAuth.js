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

export async function exchangeCodeForToken({ tokenUrl, clientId, clientSecret, code, codeVerifier, redirectUri }) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    code_verifier: codeVerifier,
    redirect_uri: redirectUri,
  });

  if (clientSecret) {
    body.set("client_secret", clientSecret);
  }

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      Origin: origin,
      "User-Agent": "pinea-customer-auth",
    },
    body: JSON.stringify({ query: CUSTOMER_PROFILE_QUERY }),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok || payload?.errors?.length) {
    const first = payload?.errors?.[0]?.message;
    throw new Error(first || "Failed to fetch Shopify customer profile.");
  }

  const customer = payload?.data?.customer || null;
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
