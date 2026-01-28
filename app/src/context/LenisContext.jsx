// context/LenisContext.js
"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { createContext, useContext } from "react";

const LenisContext = createContext(null);

export const useLenisContext = () => useContext(LenisContext);

export default function LenisProvider({ children }) {
  const lenis = useLenis(); // hook provided by ReactLenis

  return (
    <ReactLenis root>
      <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
    </ReactLenis>
  );
}
