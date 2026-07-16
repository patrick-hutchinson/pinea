// context/LenisContext.js
"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { createContext, useContext, useMemo } from "react";

import { StateContext } from "@/context/StateContext";

const LenisContext = createContext(null);

const desktopLenisOptions = {
  allowNestedScroll: true,
  lerp: 0.065,
  syncTouch: false,
  overscroll: true,
};

const touchLenisOptions = {
  allowNestedScroll: true,
  lerp: 0.045,
  syncTouch: true,
  syncTouchLerp: 0.045,
  touchMultiplier: 0.82,
  touchInertiaExponent: 1.85,
  overscroll: true,
};

export const useLenisContext = () => useContext(LenisContext);

function LenisBridge({ children }) {
  const lenis = useLenis(); // hook provided by ReactLenis

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export default function LenisProvider({ children }) {
  const { isMobile, isTouch } = useContext(StateContext);
  const shouldUseTouchLenis = isMobile === true && isTouch === true;
  const lenisOptions = useMemo(
    () => (shouldUseTouchLenis ? touchLenisOptions : desktopLenisOptions),
    [shouldUseTouchLenis],
  );

  return (
    <ReactLenis root options={lenisOptions} key={shouldUseTouchLenis ? "touch" : "default"}>
      <LenisBridge>{children}</LenisBridge>
    </ReactLenis>
  );
}
