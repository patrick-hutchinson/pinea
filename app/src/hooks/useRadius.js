// hooks/useRadius.js
import { useState, useEffect } from "react";
import { calculateRadius } from "@/helpers/calculateRadius";

export const useRadius = (count, initialWidth) => {
  const [radius, setRadius] = useState(() => calculateRadius(initialWidth, count));

  useEffect(() => {
    setRadius(calculateRadius(initialWidth, count));
  }, [initialWidth, count]);

  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setRadius(calculateRadius(window.innerWidth, count));
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [count]);

  return radius;
};
