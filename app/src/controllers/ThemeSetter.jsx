"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ThemeSetter() {
  const pathname = usePathname();

  const darkPaths = ["/portfolios/kim-da-motta", "/imprint"];

  useEffect(() => {
    const isDark = darkPaths.some((p) => pathname.includes(p));

    const root = document.documentElement;

    if (isDark) {
      root.style.setProperty("--background", "#000000");
      root.style.setProperty("--foreground", "#ffffff");
    } else {
      root.style.setProperty("--background", "#ffffff");
      root.style.setProperty("--foreground", "#000000");
    }
  }, [pathname]);

  return null;
}
