"use client";

import { Children, cloneElement, useEffect } from "react";
import styles from "./Slideshow.module.css";
import FadePresence from "../Animation/FadePresence";
import { useSlider } from "./helpers/useSlider";

const ComponentSlideshow = ({ children, className, setCurrentIndex }) => {
  const slidesArray = Children.toArray(children); // ensures children is an array

  const { current, handleMouseEnter, handleMouseLeave, handleClick, onTouchMove, onTouchStart, onTouchEnd, setCurrent } =
    useSlider({
      array: slidesArray,
      length: slidesArray.length,
      auto: false,
    });

  useEffect(() => {
    if (!setCurrentIndex) return;
    setCurrentIndex(current);
  }, [current]);

  return (
    <div style={{ position: "relative" }} className={`${styles.componentSlideshow} ${className}`}>
      <FadePresence
        className={styles.container}
        motionKey={current}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {slidesArray.map((child, index) => (index === current ? cloneElement(child, { key: index }) : null))}
      </FadePresence>

      <ul className={styles.marker_wrapper}>
        {slidesArray.map((_, index) => (
          <li
            key={index}
            className={`${styles.marker} ${index === current ? styles.current : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(index);
            }}
          />
        ))}
      </ul>
    </div>
  );
};

export default ComponentSlideshow;
