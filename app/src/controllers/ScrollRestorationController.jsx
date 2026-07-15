"use client";

import { useEffect } from "react";
import { usePathname } from "@/context/RouteContext";
import { useLenisContext } from "@/context/LenisContext";

const PRESERVE_SCROLL_KEY = "pinea_preserve_scroll_once";

export default function ScrollRestorationController() {
  const pathname = usePathname();
  const lenis = useLenisContext();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const preservedScroll = window.sessionStorage.getItem(PRESERVE_SCROLL_KEY);
    if (preservedScroll) {
      window.sessionStorage.removeItem(PRESERVE_SCROLL_KEY);

      let top = 0;
      try {
        top = Number(JSON.parse(preservedScroll)?.top) || 0;
      } catch {
        top = 0;
      }

      window.requestAnimationFrame(() => {
        lenis?.scrollTo(top, { immediate: true, force: true });
        window.scrollTo({ top, left: 0, behavior: "auto" });
        document.documentElement.scrollTop = top;
        document.body.scrollTop = top;
      });
      return;
    }

    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, lenis]);

  return null; // this component doesn’t render anything
}
