"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

import { usePathname } from "next/navigation";

export default function ThemeSetter() {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setTheme(pathname.includes("/portfolios/kim-da-motta") ? "dark" : "light");
  }, [pathname]);
}
