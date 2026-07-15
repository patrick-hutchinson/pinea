import "@/app/globals.css";
import "@/app/fonts.css";
import "lenis/dist/lenis.css";

import { useRouter } from "next/router";

import PagesShell from "@/components/Layout/PagesShell";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const shell = pageProps?.__shell || {};

  return (
    <PagesShell routeKey={router.asPath} shell={shell}>
      <Component {...pageProps} />
    </PagesShell>
  );
}
