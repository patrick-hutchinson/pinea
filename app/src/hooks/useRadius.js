import { useState, useEffect } from "react";
import { calculateRadius } from "@/helpers/calculateRadius";

export const useRadius = (count, initialWidth) => {
  const [radius, setRadius] = useState(() => calculateRadius(initialWidth, count));

  useEffect(() => {
    // calculate on mount and whenever count changes
    setRadius(calculateRadius(window.innerWidth, count));
  }, [count]);

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
