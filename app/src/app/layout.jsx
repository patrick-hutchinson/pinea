import "./globals.css";
import "./fonts.css";

import Script from "next/script";

import { getSiteData, getSearchableData, getImprint } from "@/lib/fetch";

import LenisProvider from "@/context/LenisContext";
import { StateProvider } from "@/context/StateContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CSSProvider } from "../context/CSSContext";
import { DimensionsProvider } from "../context/DimensionsContext";
import { AnimationProvider } from "../context/AnimationContext";
import { SearchProvider } from "../context/SearchContext";
import { MenuProvider } from "@/context/MenuContext";

import { ViewTransitions } from "next-view-transitions";

import SearchResults from "@/components/Search/SearchResults";
import CookieWrapper from "@/components/Cookies/CookieBanner/CookieWrapper";
import Menu from "@/components/Menu/Menu";

import ScrollRestorationController from "@/controllers/ScrollRestorationController";
import ThemeSetter from "../controllers/ThemeSetter";
import RouteVisualController from "@/controllers/RouteVisualController";
import SafariArrowScrollController from "@/controllers/SafariArrowScrollController";
import { isAuthEnabled } from "@/lib/runtimeFlags";
import { getSessionFromCookies } from "@/lib/auth/session";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export async function generateMetadata() {
  const site = await getSiteData();

  return {
    title: site.title,
    description: site.google_description,
    icons: {
      icon: [
        { url: "/icons/favicon/favicon.ico" },
        { url: "/icons/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icons/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/icons/favicon/apple-touch-icon.png" }],
      shortcut: "/icons/favicon/favicon.ico",
    },
  };
}

export const dynamic = "force-dynamic";

export default async function RootLayout({ children, params }) {
  const site = await getSiteData();
  const imprint = await getImprint();
  const [searchableData] = await Promise.all([getSearchableData()]);
  const manageSubscriptionUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL || "";
  const session = isAuthEnabled ? await getSessionFromCookies() : null;
  const isAuthenticated = Boolean(session?.email);

  return (
    <ViewTransitions>
      <html lang="en" data-theme="light" suppressHydrationWarning>
        <head>
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="e0373d4c-247e-4d86-b9e0-04ca6369c64e"
            strategy="afterInteractive"
          />
        </head>
        <CSSProvider>
          <LanguageProvider>
            <SearchProvider>
              <AnimationProvider>
                <DimensionsProvider>
                  <StateProvider>
                    <MenuProvider>
                      <RouteVisualController />
                      <SafariArrowScrollController />
                      <body>
                        <LenisProvider>
                          <ScrollRestorationController />
                          <Header
                            site={site}
                            authEnabled={isAuthEnabled}
                            manageSubscriptionUrl={manageSubscriptionUrl}
                            isAuthenticated={isAuthenticated}
                          />
                          <Menu site={site} />
                          <SearchResults searchableData={searchableData} />
                          <CookieWrapper />
                          {children}
                          <ThemeSetter />
                          <div id="hover-preview"></div>
                          <Footer site={site} imprint={imprint} />
                        </LenisProvider>
                      </body>
                    </MenuProvider>
                  </StateProvider>
                </DimensionsProvider>
              </AnimationProvider>
            </SearchProvider>
          </LanguageProvider>
        </CSSProvider>
      </html>
    </ViewTransitions>
  );
}
