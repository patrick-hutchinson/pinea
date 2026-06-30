// context/LenisContext.js
"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { createContext, useContext } from "react";

const LenisContext = createContext(null);
const lenisOptions = {
  allowNestedScroll: true,
  syncTouch: true,
  syncTouchLerp: 0.08,
  touchInertiaExponent: 1.7,
};

export const useLenisContext = () => useContext(LenisContext);

function LenisBridge({ children }) {
  const lenis = useLenis(); // hook provided by ReactLenis

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export default function LenisProvider({ children }) {
  return (
    <ReactLenis root options={lenisOptions}>
      <LenisBridge>{children}</LenisBridge>
    </ReactLenis>
  );
}
