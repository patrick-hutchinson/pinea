"use client";

import { useEffect } from "react";
import { useRef } from "react";
import { usePathname } from "@/context/RouteContext";
import { stripLocaleFromPathname } from "@/lib/i18n";

export default function ThemeSetter() {
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");
  const hasMountedRef = useRef(false);

  const darkPaths = ["/stories/portfolios/kim-da-motta", "/imprint", "/profile", "/calendar-archive"];

  useEffect(() => {
    const root = document.documentElement;

    const applyRouteTheme = () => {
      const isDark = darkPaths.some((p) => basePathname.includes(p));
      const isProfile = basePathname === "/profile" || basePathname.startsWith("/profile/");

      root.classList.toggle("dark-path-route", isDark);
      root.classList.toggle("dark-profile-route", isProfile);

      if (isDark) {
        root.style.setProperty("--background", "#000000");
        root.style.setProperty("--foreground", "#ffffff");
        root.setAttribute("data-theme", "dark");
      } else {
        root.style.setProperty("--background", "#ffffff");
        root.style.setProperty("--foreground", "#000000");
        root.setAttribute("data-theme", "light");
      }
    };

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      applyRouteTheme();
      return undefined;
    }

    const handlePageExitComplete = () => {
      applyRouteTheme();
      window.removeEventListener("pinea-page-exit-complete", handlePageExitComplete);
    };

    window.addEventListener("pinea-page-exit-complete", handlePageExitComplete);

    return () => {
      window.removeEventListener("pinea-page-exit-complete", handlePageExitComplete);
    };
  }, [basePathname]);

  return null;
}
