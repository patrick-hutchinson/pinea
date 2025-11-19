"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

import { usePathname } from "next/navigation";

export default function ThemeSetter() {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  const paths = ["/portfolios/kim-da-motta", "/imprint"];

  useEffect(() => {
    const isDark = paths.some((p) => pathname.includes(p));
    setTheme(isDark ? "dark" : "light");
  }, [pathname]);
}
