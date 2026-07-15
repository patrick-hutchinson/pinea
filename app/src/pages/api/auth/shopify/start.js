import {
  OAUTH_COOKIE_OPTIONS,
  SHOPIFY_OAUTH_COOKIE_NAME,
  createOAuthStateToken,
  generateCodeChallenge,
  generateCodeVerifier,
} from "@/lib/auth/sessionCore";
import { getShopifyAuthConfig } from "@/lib/auth/shopifyCustomerAuth";
import { getAbsoluteRequestUrl, getRequestLike, setResponseCookie } from "@/lib/pages/api";
import { isAuthEnabled } from "@/lib/runtimeFlags";

export default function handler(req, res) {
  if (!isAuthEnabled) {
    res.status(404).end();
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const { clientId, authorizeUrl, scopes, redirectUri } = getShopifyAuthConfig(getRequestLike(req));

    const requestUrl = getAbsoluteRequestUrl(req);
    const returnTo = requestUrl.searchParams.get("returnTo") || "/profile";
    const loginHint = requestUrl.searchParams.get("login_hint") || requestUrl.searchParams.get("email") || "";

    const state = crypto.randomUUID();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    const oauthStateToken = createOAuthStateToken({
      state,
      codeVerifier,
      returnTo: returnTo.startsWith("/") ? returnTo : "/profile",
    });

    const authUrl = new URL(authorizeUrl);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scopes);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("code_challenge", codeChallenge);
    authUrl.searchParams.set("code_challenge_method", "S256");
    if (loginHint) {
      authUrl.searchParams.set("login_hint", loginHint);
    }

    setResponseCookie(res, SHOPIFY_OAUTH_COOKIE_NAME, oauthStateToken, OAUTH_COOKIE_OPTIONS);
    res.redirect(307, authUrl.toString());
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to start Shopify auth." });
  }
}
