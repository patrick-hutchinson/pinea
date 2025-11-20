import "./globals.css";
import "./fonts.css";

import { getSiteData } from "@/lib/fetch";

import { ThemeProvider } from "next-themes";

import { StateProvider } from "@/context/StateContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { GlobalVariablesProvider } from "../context/GlobalVariablesContext";
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

export default async function RootLayout({ children, params }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ScrollRestorationController />

      <GlobalVariablesProvider>
        <LanguageProvider>
          <StateProvider>
            <body>
              <Header site={site} />
              <ThemeProvider enableSystem={false}>
                {children}
                <ThemeSetter />
              </ThemeProvider>
              <div id="hover-preview"></div>
              <Footer site={site} />
            </body>
          </StateProvider>
        </LanguageProvider>
      </GlobalVariablesProvider>
    </html>
  );
}
