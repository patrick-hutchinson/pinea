import Head from "next/head";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";

import LenisProvider from "@/context/LenisContext";
import { StateProvider } from "@/context/StateContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CSSProvider } from "@/context/CSSContext";
import { DimensionsProvider } from "@/context/DimensionsContext";
import { AnimationProvider } from "@/context/AnimationContext";
import { SearchProvider } from "@/context/SearchContext";
import { MenuProvider } from "@/context/MenuContext";
import PagesRouteProvider from "@/context/PagesRouteProvider";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SearchResults from "@/components/Search/SearchResults";
import CookieWrapper from "@/components/Cookies/CookieBanner/CookieWrapper";
import Menu from "@/components/Menu/Menu";

import ScrollRestorationController from "@/controllers/ScrollRestorationController";
import ThemeSetter from "@/controllers/ThemeSetter";
import RouteVisualController from "@/controllers/RouteVisualController";
import SafariArrowScrollController from "@/controllers/SafariArrowScrollController";

const pageTransition = { duration: 0.45, ease: "easeInOut" };

const PagesShell = ({ children, routeKey, shell = {} }) => {
  const title = shell.site?.title || "P.IN.E.A";
  const description = shell.site?.google_description || "";

  return (
    <>
      <Head>
        <title>{title}</title>
        {description ? <meta name="description" content={description} /> : null}
        <link rel="icon" href="/icons/favicon/favicon.ico" />
        <link rel="icon" href="/icons/favicon/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/icons/favicon/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/favicon/apple-touch-icon.png" />
      </Head>

      <Script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id="e0373d4c-247e-4d86-b9e0-04ca6369c64e"
        strategy="afterInteractive"
      />

      <CSSProvider>
        <PagesRouteProvider>
          <LanguageProvider>
            <SearchProvider>
              <AnimationProvider>
                <DimensionsProvider>
                  <StateProvider>
                    <MenuProvider>
                      <RouteVisualController />
                      <SafariArrowScrollController />
                      <LenisProvider>
                        <ScrollRestorationController />
                        <Header
                          site={shell.site}
                          authEnabled={shell.authEnabled}
                          manageAccountUrl={shell.manageAccountUrl}
                          manageSubscriptionUrl={shell.manageSubscriptionUrl}
                          isAuthenticated={shell.isAuthenticated}
                        />
                        <Menu site={shell.site} menu={shell.menu} shopEnabled={shell.shopEnabled} />
                        <SearchResults searchableData={shell.searchableData || []} />
                        <CookieWrapper />
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.div
                            key={routeKey}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={pageTransition}
                          >
                            {children}
                          </motion.div>
                        </AnimatePresence>
                        <ThemeSetter />
                        <div id="hover-preview"></div>
                        <Footer site={shell.site} imprint={shell.imprint} />
                      </LenisProvider>
                    </MenuProvider>
                  </StateProvider>
                </DimensionsProvider>
              </AnimationProvider>
            </SearchProvider>
          </LanguageProvider>
        </PagesRouteProvider>
      </CSSProvider>
    </>
  );
};

export default PagesShell;
