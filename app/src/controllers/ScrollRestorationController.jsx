"use client";

import { useEffect } from "react";
import { usePathname } from "@/context/RouteContext";
import { useLenisContext } from "@/context/LenisContext";

export default function ScrollRestorationController() {
  const pathname = usePathname();
  const lenis = useLenisContext();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Force top-left position instantly on every route change.
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, lenis]);

  return null; // this component doesn’t render anything
}
