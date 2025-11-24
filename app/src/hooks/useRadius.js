// hooks/useRadius.js
import { useState, useEffect } from "react";
import { calculateRadius } from "@/helpers/calculateRadius";

export const useRadius = (count, initialWidth) => {
  const [radius, setRadius] = useState(() => calculateRadius(initialWidth, count));
  const [targetWidth, setTargetWidth] = useState(null);

  useEffect(() => {
    setRadius(calculateRadius(initialWidth, count));
  }, [initialWidth, count]);

  useEffect(() => {
    setTargetWidth(window.innerWidth < 800 ? 800 : window.innerWidth);
  }, [count]);

  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setRadius(calculateRadius(targetWidth, count));
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [count, targetWidth]);

  return radius;
};
