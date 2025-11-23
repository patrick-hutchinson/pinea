"use client";

import { createContext, useState, useEffect } from "react";

// Create the context
export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [deviceDimensions, setDeviceDimensions] = useState({ width: 0, height: 0 });
  const [isSafari, setIsSafari] = useState(false);

  // Detect if the screen is mobile size
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 769;
      setIsMobile((prev) => (prev !== newIsMobile ? newIsMobile : prev));

      setDeviceDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize); // Listen for window resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isSafari) {
      document.body.classList.add("is_safari");
    } else {
      document.body.classList.remove("is_safari");
    }
  }, [isSafari]);

  useEffect(() => {
    const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsSafari(safari);
  }, []);

  return <StateContext.Provider value={{ isMobile, isSafari, deviceDimensions }}>{children}</StateContext.Provider>;
};
