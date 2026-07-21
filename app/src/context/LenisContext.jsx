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

const safariLenisOptions = {
  smoothWheel: false,
  syncTouch: false,
  allowNestedScroll: false,
  overscroll: false,
};

export const useLenisContext = () => useContext(LenisContext);

const createNativeScrollController = () => ({
  resize: () => {},
  start: () => {},
  stop: () => {},
  scrollTo: (target, options = {}) => {
    if (typeof window === "undefined") return;

    const offset = Number(options.offset) || 0;
    let top = 0;

    if (typeof target === "number") {
      top = target;
    } else if (typeof target === "string") {
      const element = document.querySelector(target);
      if (!element) return;
      top = element.getBoundingClientRect().top + window.scrollY;
    } else if (target?.getBoundingClientRect) {
      top = target.getBoundingClientRect().top + window.scrollY;
    }

    window.scrollTo({
      top: top + offset,
      behavior: options.immediate || options.duration === 0 ? "auto" : "smooth",
    });
  },
});

function LenisBridge({ children }) {
  const lenis = useLenis(); // hook provided by ReactLenis

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export default function LenisProvider({ children }) {
  const { isMobile, isTouch, isSafari } = useContext(StateContext);
  const nativeScrollController = useMemo(() => createNativeScrollController(), []);
  const shouldUseTouchLenis = isMobile === true && isTouch === true;
  const lenisOptions = useMemo(() => {
    if (isSafari) return safariLenisOptions;
    return shouldUseTouchLenis ? touchLenisOptions : desktopLenisOptions;
  }, [isSafari, shouldUseTouchLenis]);

  const lenisKey = isSafari ? "safari-default" : shouldUseTouchLenis ? "touch" : "default";

  if (isSafari !== false) {
    return <LenisContext.Provider value={nativeScrollController}>{children}</LenisContext.Provider>;
  }

  return (
    <ReactLenis root options={lenisOptions} key={lenisKey}>
      <LenisBridge>{children}</LenisBridge>
    </ReactLenis>
  );
}
