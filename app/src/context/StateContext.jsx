"use client";

import { createContext, useState, useEffect, useMemo } from "react";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(null);
  const [isTablet, setIsTablet] = useState(null);
  const [isSafari, setIsSafari] = useState(null);
  const [isTouch, setIsTouch] = useState(null); // ← NEW

  // More performant isMobile detection
  useEffect(() => {
    const mqlMobile = window.matchMedia("(max-width: 768px)");
    const mqlTablet = window.matchMedia("(min-width: 769px) and (max-width: 1280px)");

    const handleMobileChange = (e) => setIsMobile(e.matches);
    const handleTabletChange = (e) => setIsTablet(e.matches);

    // Initial values
    setIsMobile(mqlMobile.matches);
    setIsTablet(mqlTablet.matches);

    // Listen to changes
    mqlMobile.addEventListener("change", handleMobileChange);
    mqlTablet.addEventListener("change", handleTabletChange);

    // Cleanup
    return () => {
      mqlMobile.removeEventListener("change", handleMobileChange);
      mqlTablet.removeEventListener("change", handleTabletChange);
    };
  }, []);

  // Safari flag
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const hasTouch =
      navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;

    setIsTouch(hasTouch);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is_safari", isSafari);
  }, [isSafari]);

  // ⚡️ Derived states (correct way)
  const isDesktop = useMemo(() => isMobile === false && isTouch === false, [isMobile, isTouch]);

  return (
    <StateContext.Provider value={{ isMobile, isTablet, isTouch, isSafari, isDesktop }}>
      {children}
    </StateContext.Provider>
  );
};
