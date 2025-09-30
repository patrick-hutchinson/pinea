import "./globals.css";
import "./fonts.css";

import ScrollRestorationController from "@/controllers/ScrollRestorationController";

import { StateProvider } from "../context/StateContext";
import Header from "../components/Header/Header";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "PINEA",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ScrollRestorationController />
      <StateProvider>
        <body>
          <Header />
          {children}
        </body>
      </StateProvider>
    </html>
  );
}
