"use client";

import { useState, useEffect, useRef } from "react";
import Media from "@/components/Media/Media";
import styles from "./Slideshow.module.css";
import FadePresence from "../Animation/FadePresence";

const Slideshow = ({ media }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  const next = () => {
    setCurrent((prev) => (prev + 1) % media.length);
  };

  // auto advance
  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(next, 4000);
    }

    return () => clearInterval(intervalRef.current);
  }, [paused, media.length]);

  const handleMouseEnter = () => {
    setPaused(true);
    clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    setPaused(false);
  };

  const handleClick = () => {
    next();
  };

  return (
    <FadePresence
      className={styles.container}
      motionKey={media[current].url}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <Media medium={media[current].medium} />

      <ul className={styles.marker_wrapper}>
        {media.map((_, index) => (
          <li
            key={index}
            className={`${styles.marker} ${index === current ? styles.current : ""}`}
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering next() when clicking marker
              setCurrent(index);
            }}
          />
        ))}
      </ul>
    </FadePresence>
  );
};

export default Slideshow;
