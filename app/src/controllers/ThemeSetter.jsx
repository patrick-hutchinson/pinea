"use client";

import { useEffect } from "react";
import { usePathname } from "@/context/RouteContext";
import { stripLocaleFromPathname } from "@/lib/i18n";

export default function ThemeSetter() {
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");

  const darkPaths = ["/stories/portfolios/kim-da-motta", "/imprint", "/profile", "/calendar-archive"];

  useEffect(() => {
    const isDark = darkPaths.some((p) => basePathname.includes(p));
    const isProfile = basePathname === "/profile" || basePathname.startsWith("/profile/");
    const root = document.documentElement;
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
  }, [basePathname]);

  return null;
}
