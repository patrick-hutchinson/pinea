"use client";

import { usePathname } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const pathname = usePathname;
  const [hasEntered, setHasEntered] = useState(pathname !== "/");
  const [transitionEnd, setTransitionEnd] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setHasEntered(true);
    }
  }, [pathname]);

  return (
    <AnimationContext.Provider value={{ hasEntered, setHasEntered, transitionEnd, setTransitionEnd }}>
      {children}
    </AnimationContext.Provider>
  );
};
