"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

const BLURRED_ICON_ROUTES = new Set([
  "/about",
  "/news",
  "/archive",
  "/open-calls",
  "/openCall",
  "/memberships",
  "/stories",
  "/print-periodical",
]);

export default function RouteVisualController() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;

    const applyRouteVisualClass = () => {
      root.classList.toggle("icon-blur-routes", BLURRED_ICON_ROUTES.has(pathname || ""));
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
  }, [pathname]);

  return null;
}
