"use client";
import { createContext, useState } from "react";

export const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [hasEntered, setHasEntered] = useState(false);
  const [transitionEnd, setTransitionEnd] = useState(false);

  return (
    <AnimationContext.Provider value={{ hasEntered, setHasEntered, transitionEnd, setTransitionEnd }}>
      {children}
    </AnimationContext.Provider>
  );
};
