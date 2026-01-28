import "./globals.css";
import "./fonts.css";

import Script from "next/script";

import { getSiteData, getSearchableData } from "@/lib/fetch";
import { getNewsletterSettings } from "@/lib/fetch";

import { ThemeProvider } from "next-themes";

import { StateProvider } from "@/context/StateContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CSSProvider } from "../context/CSSContext";
import { DimensionsProvider } from "../context/DimensionsContext";
import { AnimationProvider } from "../context/AnimationContext";
import { SearchProvider } from "../context/SearchContext";

import { ViewTransitions } from "next-view-transitions";

import SearchOverlay from "@/components/Search/SearchOverlay";
import CookieWrapper from "@/components/Cookies/CookieBanner/CookieWrapper";

import ScrollRestorationController from "@/controllers/ScrollRestorationController";
import ThemeSetter from "../controllers/ThemeSetter";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const [site] = await Promise.all([getSiteData()]);
const [newsletter] = await Promise.all([getNewsletterSettings()]);

const [searchableData] = await Promise.all([getSearchableData()]);

export const metadata = {
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

export const dynamic = "force-dynamic";

export default async function RootLayout({ children, params }) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
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
                    <ScrollRestorationController />
                    <body>
                      <Header site={site} />
                      <SearchOverlay searchableData={searchableData} />
                      <CookieWrapper />
                      <ThemeProvider enableSystem={false}>
                        {children}
                        <ThemeSetter />
                      </ThemeProvider>
                      <div id="hover-preview"></div>
                      <Footer site={site} newsletter={newsletter} />
                    </body>
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
