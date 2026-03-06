import { useEffect, useState } from "react";

export const useMediaDimensions = (ref, dependencies = []) => {
  const [mediaWidth, setMediaWidth] = useState(null);
  const [mediaHeight, setMediaHeight] = useState(null);

  useEffect(() => {
    if (!ref?.current) return undefined;

    const element = ref.current;
    let rafId1 = null;
    let rafId2 = null;
    let timeoutId = null;

    const measure = () => {
      if (!element) return;
      const { width, height } = element.getBoundingClientRect();
      if (Number.isFinite(width) && width > 0) {
        setMediaWidth((prev) => (prev !== width ? width : prev));
      }
      if (Number.isFinite(height) && height > 0) {
        setMediaHeight((prev) => (prev !== height ? height : prev));
      }
    };

    // Immediate + deferred measurements to catch late image/video sizing and transform-settling.
    measure();
    rafId1 = requestAnimationFrame(measure);
    rafId2 = requestAnimationFrame(() => requestAnimationFrame(measure));
    timeoutId = setTimeout(measure, 220);

    let observer = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      observer.observe(element);
    }

    window.addEventListener("resize", measure);
    element.addEventListener("transitionend", measure);

    return () => {
      if (rafId1) cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
      if (timeoutId) clearTimeout(timeoutId);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", measure);
      element.removeEventListener("transitionend", measure);
    };
  }, [ref, ...dependencies]);

  return { mediaWidth, mediaHeight };
};
