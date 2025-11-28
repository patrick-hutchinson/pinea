"use client";

import { createContext, useState, useEffect } from "react";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(null);
  const [isTablet, setIsTablet] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

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
    document.body.classList.toggle("is_safari", isSafari);
  }, [isSafari]);

  return <StateContext.Provider value={{ isMobile, isTablet, isSafari }}>{children}</StateContext.Provider>;
};
