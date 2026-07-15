import {
  OAUTH_COOKIE_OPTIONS,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  SHOPIFY_OAUTH_COOKIE_NAME,
  createSessionToken,
  decodeOAuthStateToken,
} from "@/lib/auth/sessionCore";
import { exchangeCodeForToken, fetchCustomerProfile, getShopifyAuthConfig } from "@/lib/auth/shopifyCustomerAuth";
import { getAbsoluteRequestUrl, getRequestLike, parseCookies, setResponseCookie } from "@/lib/pages/api";
import { isAuthEnabled } from "@/lib/runtimeFlags";

export default async function handler(req, res) {
  if (!isAuthEnabled) {
    res.status(404).end();
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const url = getAbsoluteRequestUrl(req);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const authError = url.searchParams.get("error");
  const authErrorDescription = url.searchParams.get("error_description");

  const fail = (message) => {
    const errorUrl = new URL("/", url.origin);
    errorUrl.searchParams.set("error", message);

    setResponseCookie(res, SHOPIFY_OAUTH_COOKIE_NAME, "", {
      ...OAUTH_COOKIE_OPTIONS,
      maxAge: 0,
    });
    res.redirect(307, errorUrl.toString());
  };

  if (authError) {
    fail(authErrorDescription || authError);
    return;
  }

  if (!code || !state) {
    fail("Missing OAuth callback parameters.");
    return;
  }

  try {
    const cookies = parseCookies(req.headers.cookie || "");
    const oauthState = decodeOAuthStateToken(cookies[SHOPIFY_OAUTH_COOKIE_NAME]);

    if (!oauthState || oauthState.state !== state || !oauthState.codeVerifier) {
      fail("Invalid or expired auth state.");
      return;
    }

    const { tokenUrl, clientId, clientSecret, redirectUri, apiUrl } = getShopifyAuthConfig(getRequestLike(req));
    const tokenResponse = await exchangeCodeForToken({
      tokenUrl,
      clientId,
      clientSecret,
      code,
      codeVerifier: oauthState.codeVerifier,
      redirectUri,
    });

    const accessToken = tokenResponse?.access_token;
    const idToken = tokenResponse?.id_token || null;

    if (!accessToken) {
      fail("Shopify did not return an access token.");
      return;
    }

    if (typeof accessToken !== "string" || !accessToken.startsWith("shcat_")) {
      fail(
        "Invalid customer token. Check SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_URL / SHOPIFY_CUSTOMER_ACCOUNT_API_URL from Shopify well-known discovery endpoints.",
      );
      return;
    }

    const customer = await fetchCustomerProfile({ apiUrl, accessToken, idToken, origin: url.origin });
    const sessionToken = createSessionToken({
      id: customer.shopifyCustomerId,
      email: customer.email,
      name: customer.name,
      shopifyCustomerId: customer.shopifyCustomerId,
    });

    const destination =
      typeof oauthState.returnTo === "string" && oauthState.returnTo.startsWith("/") ? oauthState.returnTo : "/profile";

    setResponseCookie(res, SESSION_COOKIE_NAME, sessionToken, SESSION_COOKIE_OPTIONS);
    setResponseCookie(res, SHOPIFY_OAUTH_COOKIE_NAME, "", {
      ...OAUTH_COOKIE_OPTIONS,
      maxAge: 0,
    });
    res.redirect(307, new URL(destination, url.origin).toString());
  } catch (error) {
    fail(error instanceof Error ? error.message : "Login failed.");
  }
}
