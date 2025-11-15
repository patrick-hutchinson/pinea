"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeSetter({ mode }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    // When mounted → set theme according to page
    setTheme(mode);

    // When unmounting → reset to light
    return () => {
      setTheme("light");
    };
  }, [mode, setTheme]);

  return null;
}
