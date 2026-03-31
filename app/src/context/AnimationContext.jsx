"use client";

import { usePathname } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { stripLocaleFromPathname } from "@/lib/i18n";

export const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");
  const [hasEntered, setHasEntered] = useState(basePathname !== "/");
  const [transitionEnd, setTransitionEnd] = useState(false);

  useEffect(() => {
    if (basePathname !== "/") {
      console.log("setting has entered true!");
      setHasEntered(true);
    }
  }, [basePathname]);

  return (
    <AnimationContext.Provider value={{ hasEntered, setHasEntered, transitionEnd, setTransitionEnd }}>
      {children}
    </AnimationContext.Provider>
  );
};
