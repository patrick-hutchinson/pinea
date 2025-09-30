import "./globals.css";
import "./fonts.css";

import { getSiteData } from "@/lib/fetch";

import ScrollRestorationController from "@/controllers/ScrollRestorationController";

import { StateProvider } from "../context/StateContext";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "PINEA",
  description: "",
};

const [siteData] = await Promise.all([getSiteData()]);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ScrollRestorationController />
      <StateProvider>
        <body>
          <Header />
          {children}
          <div id="hover-preview"></div>
          <Footer siteData={siteData} />
        </body>
      </StateProvider>
    </html>
  );
}
