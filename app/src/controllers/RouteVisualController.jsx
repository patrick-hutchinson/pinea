"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { stripLocaleFromPathname } from "@/lib/i18n";

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

  useLayoutEffect(() => {
    const root = document.documentElement;

    const applyRouteVisualClass = () => {
      root.classList.toggle("icon-blur-routes", hasBlurredIconRoute(basePathname));
    };

    if (root.classList.contains("is-route-transitioning")) {
      const handleTransitionFinished = () => {
        applyRouteVisualClass();
        window.removeEventListener("view-transition-finished", handleTransitionFinished);
      };

      window.addEventListener("view-transition-finished", handleTransitionFinished);
      return () => window.removeEventListener("view-transition-finished", handleTransitionFinished);
    }

    applyRouteVisualClass();
  }, [basePathname]);

  return null;
}
