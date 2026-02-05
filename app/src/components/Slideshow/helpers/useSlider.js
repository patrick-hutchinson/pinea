import { useState, useEffect, useRef, useContext } from "react";

import { StateContext } from "@/context/StateContext";

export function useSlider({ array, length, auto }) {
  const { isTouch } = useContext(StateContext);

  const intervalRef = useRef(null);

  const [paused, setPaused] = useState(false);
  const [current, setCurrent] = useState(0);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const next = () => setCurrent((prev) => (prev + 1) % length);
  const prev = () => setCurrent((prev) => (prev - 1 + length) % length);

  const minSwipeDistance = 50; // px

  const onTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) < minSwipeDistance) return; // ignore tiny swipes

    if (distance > 0) {
      // swipe left → next
      next();
    } else {
      // swipe right → prev
      prev();
    }
  };

  const handleClick = () => {
    // if (isTouch) return;
    next();
  };

  // AUTO Advancing

  useEffect(() => {
    if (!auto) return;
    const isVideo = array[current]?.medium?.type === "video";

    // Don't auto advance when it's a video
    if (isVideo || paused) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(next, 4000);

    return () => clearInterval(intervalRef.current);
  }, [current, paused, length]);

  const handleMouseEnter = () => {
    if (isTouch || auto) return;
    setPaused(true);
    clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    if (isTouch || auto) return;
    setPaused(false);
  };

  return {
    current,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    onTouchMove,
    onTouchStart,
    onTouchEnd,
    setCurrent,
    next,
    prev,
  };
}
