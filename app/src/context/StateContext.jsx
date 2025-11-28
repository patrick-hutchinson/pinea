"use client";

import { createContext, useState, useEffect } from "react";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(null);
  const [isSafari, setIsSafari] = useState(false);

  // More performant isMobile detection
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const handleChange = (e) => setIsMobile(e.matches);

    setIsMobile(mql.matches);
    mql.addEventListener("change", handleChange);

    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // Safari flag
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is_safari", isSafari);
  }, [isSafari]);

  return <StateContext.Provider value={{ isMobile, isSafari }}>{children}</StateContext.Provider>;
};
