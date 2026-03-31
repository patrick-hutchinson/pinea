import { NextResponse } from "next/server";

import {
  OAUTH_COOKIE_OPTIONS,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  SHOPIFY_OAUTH_COOKIE_NAME,
  createSessionToken,
  decodeOAuthStateToken,
} from "@/lib/auth/session";
import { exchangeCodeForToken, fetchCustomerProfile, getShopifyAuthConfig } from "@/lib/auth/shopifyCustomerAuth";
import { isAuthEnabled } from "@/lib/runtimeFlags";

export async function GET(request) {
  if (!isAuthEnabled) {
    return new Response(null, { status: 404 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const authError = url.searchParams.get("error");
  const authErrorDescription = url.searchParams.get("error_description");

  const fail = (message) => {
    const errorUrl = new URL("/login", url.origin);
    errorUrl.searchParams.set("error", message);

    const response = NextResponse.redirect(errorUrl.toString());
    response.cookies.set(SHOPIFY_OAUTH_COOKIE_NAME, "", {
      ...OAUTH_COOKIE_OPTIONS,
      maxAge: 0,
    });
    return response;
  };

  if (authError) {
    return fail(authErrorDescription || authError);
  }

  if (!code || !state) {
    return fail("Missing OAuth callback parameters.");
  }

  try {
    const oauthCookie = request.cookies.get(SHOPIFY_OAUTH_COOKIE_NAME)?.value;
    const oauthState = decodeOAuthStateToken(oauthCookie);

    if (!oauthState || oauthState.state !== state || !oauthState.codeVerifier) {
      return fail("Invalid or expired auth state.");
    }

    const { tokenUrl, clientId, clientSecret, redirectUri, apiUrl } = getShopifyAuthConfig(request);
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
      return fail("Shopify did not return an access token.");
    }

    const customer = await fetchCustomerProfile({ apiUrl, accessToken, idToken });
    const sessionToken = createSessionToken({
      id: customer.shopifyCustomerId,
      email: customer.email,
      name: customer.name,
      shopifyCustomerId: customer.shopifyCustomerId,
    });

    const destination =
      typeof oauthState.returnTo === "string" && oauthState.returnTo.startsWith("/") ? oauthState.returnTo : "/profile";

    const response = NextResponse.redirect(new URL(destination, url.origin).toString());
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, SESSION_COOKIE_OPTIONS);
    response.cookies.set(SHOPIFY_OAUTH_COOKIE_NAME, "", {
      ...OAUTH_COOKIE_OPTIONS,
      maxAge: 0,
    });
    return response;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Login failed.");
  }
}
