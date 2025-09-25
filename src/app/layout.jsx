import "./globals.css";
import "./fonts.css";

import ScrollRestorationController from "@/controllers/ScrollRestorationController";

import { StateProvider } from "../context/StateContext";

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
        <body>{children}</body>
      </StateProvider>
    </html>
  );
}
