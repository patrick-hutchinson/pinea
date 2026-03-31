"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { stripLocaleFromPathname } from "@/lib/i18n";

export default function ThemeSetter() {
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");

  const darkPaths = ["/stories/portfolios/kim-da-motta", "/imprint"];

  useEffect(() => {
    const isDark = darkPaths.some((p) => basePathname.includes(p));
    const root = document.documentElement;

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
