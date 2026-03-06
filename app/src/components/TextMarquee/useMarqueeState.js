import { useEffect, useRef, useState } from "react";

export const MARQUEE_GAP_PX = 6;
export const MARQUEE_SPEED_PX_PER_SEC = 40;
const OVERFLOW_EPSILON_PX = 2;
const STABILIZE_MS = 120;

export const useMarqueeState = ({
  text,
  mediaWidth,
  isActive,
  fontSize,
  gapPx = MARQUEE_GAP_PX,
  speedPxPerSec = MARQUEE_SPEED_PX_PER_SEC,
}) => {
  const measureRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);
  const [resolvedOverflow, setResolvedOverflow] = useState(false);

  useEffect(() => {
    if (!measureRef.current) return undefined;

    const element = measureRef.current;
    const measure = () => {
      const width = element.scrollWidth || 0;
      setTextWidth((prev) => (prev !== width ? width : prev));
    };

    measure();
    const rafId = requestAnimationFrame(measure);

    let observer = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      observer.observe(element);
    }

    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [text, fontSize, mediaWidth]);

  const hasMeasurements = Boolean(mediaWidth && textWidth);
  const overflowCandidate = hasMeasurements ? textWidth + gapPx > mediaWidth + OVERFLOW_EPSILON_PX : false;

  useEffect(() => {
    // Reset immediately when there is no reliable measurement.
    if (!hasMeasurements) {
      setResolvedOverflow(false);
      return undefined;
    }

    // Stabilize overflow changes to avoid flicker when media width settles after land/resize.
    const timeoutId = setTimeout(() => {
      setResolvedOverflow(overflowCandidate);
    }, STABILIZE_MS);

    return () => clearTimeout(timeoutId);
  }, [hasMeasurements, overflowCandidate, mediaWidth, textWidth]);

  const isOverflowing = resolvedOverflow;
  const shouldScroll = Boolean(isActive && resolvedOverflow);
  const scrollDistance = textWidth + gapPx;
  const duration = scrollDistance > 0 ? scrollDistance / speedPxPerSec : 0;

  return {
    measureRef,
    textWidth,
    hasMeasurements,
    isOverflowing,
    shouldScroll,
    scrollDistance,
    duration,
    gapPx,
  };
};
