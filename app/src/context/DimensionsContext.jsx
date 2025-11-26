"use client";

import { createContext, useState, useEffect } from "react";

export const DimensionsContext = createContext();

export const DimensionsProvider = ({ children }) => {
  const [deviceDimensions, setDeviceDimensions] = useState({ width: 0, height: 0 });

  // More performant isMobile detection
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const handleChange = (e) => setIsMobile(e.matches);

    mql.addEventListener("change", handleChange);

    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // Throttled dimension updates
  useEffect(() => {
    let timeout;

    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setDeviceDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 120);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <DimensionsContext.Provider value={{ deviceDimensions }}>{children}</DimensionsContext.Provider>;
};
