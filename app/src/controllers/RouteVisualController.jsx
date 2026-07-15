"use client";

import { usePathname } from "@/context/RouteContext";
import { useLayoutEffect, useRef } from "react";
import { stripLocaleFromPathname } from "@/lib/i18n";

const PAGE_EXIT_DURATION_MS = 450;

const BLURRED_ICON_ROUTES = new Set([
  "/about",
  "/news",
  "/archive",
  "/open-calls",
  "/openCall",
  "/memberships",
  "/stories",
  "/shop",
  "/print-periodical",
]);

const hasBlurredIconRoute = (pathname) => {
  if (!pathname) return false;
  if (BLURRED_ICON_ROUTES.has(pathname)) return true;
  return pathname.startsWith("/shop/");
};

export default function RouteVisualController() {
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");
  const hasMountedRef = useRef(false);
  const timeoutRef = useRef(null);

  useLayoutEffect(() => {
    const root = document.documentElement;

    const applyRouteVisualClass = () => {
      root.classList.toggle("icon-blur-routes", hasBlurredIconRoute(basePathname));
    };

    window.clearTimeout(timeoutRef.current);

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      applyRouteVisualClass();
      return undefined;
    }

    if (root.classList.contains("is-route-transitioning")) {
      const handleTransitionFinished = () => {
        applyRouteVisualClass();
        window.removeEventListener("view-transition-finished", handleTransitionFinished);
      };

      window.addEventListener("view-transition-finished", handleTransitionFinished);
      return () => window.removeEventListener("view-transition-finished", handleTransitionFinished);
    }

    timeoutRef.current = window.setTimeout(applyRouteVisualClass, PAGE_EXIT_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutRef.current);
    };
  }, [basePathname]);

  return null;
}
