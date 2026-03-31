import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth/session";
import { isAuthEnabled } from "@/lib/runtimeFlags";

export async function GET(request) {
  if (!isAuthEnabled) {
    return new Response(null, { status: 404 });
  }

  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo");
  const destination = returnTo && returnTo.startsWith("/") ? returnTo : "/";

  const response = NextResponse.redirect(new URL(destination, url.origin).toString());
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });

  return response;
}
