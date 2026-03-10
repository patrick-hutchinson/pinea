"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

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

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("icon-blur-routes", BLURRED_ICON_ROUTES.has(pathname || ""));

    return () => {
      root.classList.remove("icon-blur-routes");
    };
  }, [pathname]);

  return null;
}
