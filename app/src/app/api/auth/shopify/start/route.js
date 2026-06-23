import { NextResponse } from "next/server";

import {
  OAUTH_COOKIE_OPTIONS,
  SHOPIFY_OAUTH_COOKIE_NAME,
  createOAuthStateToken,
  generateCodeChallenge,
  generateCodeVerifier,
} from "@/lib/auth/session";
import { getShopifyAuthConfig } from "@/lib/auth/shopifyCustomerAuth";
import { isAuthEnabled } from "@/lib/runtimeFlags";

export async function GET(request) {
  if (!isAuthEnabled) {
    return new Response(null, { status: 404 });
  }

  try {
    const { clientId, authorizeUrl, scopes, redirectUri } = getShopifyAuthConfig(request);

    const requestUrl = new URL(request.url);
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

    const response = NextResponse.redirect(authUrl.toString());
    response.cookies.set(SHOPIFY_OAUTH_COOKIE_NAME, oauthStateToken, OAUTH_COOKIE_OPTIONS);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start Shopify auth." },
      { status: 500 },
    );
  }
}
