import { useState, useEffect } from "react";
import { calculateRadius } from "@/helpers/calculateRadius";

export const useRadius = (count, initialWidth, minRadius = count * 100) => {
  const compute = (w, c) => {
    const r = calculateRadius(w, c);
    return Math.max(r, minRadius);
  };

  const [radius, setRadius] = useState(() => compute(initialWidth, count));

  useEffect(() => {
    setRadius(compute(window.innerWidth, count));
  }, [count]);

  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setRadius(compute(window.innerWidth, count));
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
