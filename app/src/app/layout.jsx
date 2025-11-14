import "./globals.css";
import "./fonts.css";

import { getSiteData } from "@/lib/fetch";

import ScrollRestorationController from "@/controllers/ScrollRestorationController";

import { StateProvider } from "@/context/StateContext";
import { GlobalVariablesProvider } from "../context/GlobalVariablesContext";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "PINEA",
  description: "",
};

const [site] = await Promise.all([getSiteData()]);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ScrollRestorationController />
      <GlobalVariablesProvider>
        <StateProvider>
          <body>
            <Header />
            {children}
            <div id="hover-preview"></div>
            <Footer site={site} />
          </body>
        </StateProvider>
      </GlobalVariablesProvider>
    </html>
  );
}
