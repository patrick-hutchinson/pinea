import "@/styles/globals.css";
import "@/styles/fonts.css";
import "lenis/dist/lenis.css";

import { SpeedInsights } from "@vercel/speed-insights/next";

import { useRouter } from "next/router";

import PagesShell from "@/components/Layout/PagesShell";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const shell = pageProps?.__shell || {};
  const routeKey = router.asPath.split("#")[0];

  return (
    <>
      <SpeedInsights />

      <PagesShell routeKey={routeKey} shell={shell}>
        <Component {...pageProps} />
      </PagesShell>
    </>
  );
}
