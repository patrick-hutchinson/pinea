// hooks/useScrollToHash.js
"use client";

import { useEffect } from "react";
import { useLenisContext } from "@/context/LenisContext";

export const useScrollToHash = (offset = 0, deps = []) => {
  const lenis = useLenisContext();

  useEffect(() => {
    const scroll = () => {
      if (!window.location.hash) return;

      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      const y = el.getBoundingClientRect().top + window.scrollY + offset;

      if (lenis) {
        lenis.scrollTo(y, { duration: 0.8 });
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    };

    const handleTransitionFinished = () => {
      // double rAF ensures layout is settled
      requestAnimationFrame(() => {
        requestAnimationFrame(scroll);
      });
    };

    // direct load
    handleTransitionFinished();

    window.addEventListener("hashchange", handleTransitionFinished);
    window.addEventListener("view-transition-finished", handleTransitionFinished);

    return () => {
      window.removeEventListener("hashchange", handleTransitionFinished);
      window.removeEventListener("view-transition-finished", handleTransitionFinished);
    };
  }, [lenis, offset, ...deps]);
};
