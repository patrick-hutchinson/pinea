"use client";

import { usePathname } from "@/context/RouteContext";
import { useLayoutEffect, useRef } from "react";
import { stripLocaleFromPathname } from "@/lib/i18n";

const BLURRED_ICON_ROUTES = new Set([
  "/about",
  "/news",
  "/archive",
  "/contributors",
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

  useLayoutEffect(() => {
    const root = document.documentElement;

    const applyRouteVisualClass = () => {
      root.classList.toggle("icon-blur-routes", hasBlurredIconRoute(basePathname));
    };

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      applyRouteVisualClass();
      return undefined;
    }

    const handlePageExitComplete = () => {
      applyRouteVisualClass();
      window.removeEventListener("pinea-page-exit-complete", handlePageExitComplete);
    };

    window.addEventListener("pinea-page-exit-complete", handlePageExitComplete);

    return () => {
      window.removeEventListener("pinea-page-exit-complete", handlePageExitComplete);
    };
  }, [basePathname]);

  return null;
}
