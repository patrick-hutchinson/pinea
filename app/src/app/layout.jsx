import "./globals.css";
import "./fonts.css";

import { getSiteData } from "@/lib/fetch";
import { getNewsletterSettings } from "@/lib/fetch";

import { ThemeProvider } from "next-themes";

import { StateProvider } from "@/context/StateContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CSSProvider } from "../context/CSSContext";
import { DimensionsProvider } from "../context/DimensionsContext";
import { AnimationProvider } from "../context/AnimationContext";

import ScrollRestorationController from "@/controllers/ScrollRestorationController";
import ThemeSetter from "../controllers/ThemeSetter";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "PINEA",
  description: "",
};

const [site] = await Promise.all([getSiteData()]);
const [newsletter] = await Promise.all([getNewsletterSettings()]);

export default async function RootLayout({ children, params }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <CSSProvider>
        <LanguageProvider>
          <AnimationProvider>
            <DimensionsProvider>
              <StateProvider>
                <ScrollRestorationController />
                <body>
                  <Header site={site} />
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
        </LanguageProvider>
      </CSSProvider>
    </html>
  );
}
