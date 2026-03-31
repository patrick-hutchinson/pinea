import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["de", "en"];
const DEFAULT_LOCALE = "de";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  const hasLocale = LOCALES.includes(maybeLocale);

  if (!hasLocale) {
    const cookieLocale = request.cookies.get("locale")?.value;
    const targetLocale = LOCALES.includes(cookieLocale || "") ? (cookieLocale as (typeof LOCALES)[number]) : DEFAULT_LOCALE;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathname === "/" ? `/${targetLocale}` : `/${targetLocale}${pathname}`;
    redirectUrl.search = search;
    return NextResponse.redirect(redirectUrl);
  }

  const rewrittenUrl = request.nextUrl.clone();
  const strippedPath = `/${segments.slice(2).join("/")}`.replace(/\/+/g, "/");
  rewrittenUrl.pathname = strippedPath === "/" ? "/" : strippedPath.replace(/\/$/, "") || "/";

  const response = NextResponse.rewrite(rewrittenUrl);
  response.cookies.set("locale", maybeLocale, { path: "/" });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
