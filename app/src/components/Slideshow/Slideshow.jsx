"use client";

import { useState, useEffect } from "react";
import Media from "@/components/Media/Media";

import styles from "./Slideshow.module.css";
import FadePresence from "../Animation/FadePresence";

const Slideshow = ({ media }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % media.length);
    }, 4000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [media.length]);

  return (
    <FadePresence className={styles.container} motionKey={media[current].url}>
      <Media medium={media[current].medium} />

      <ul className={styles.marker_wrapper}>
        {media.map((_, index) => {
          return (
            <li
              key={index}
              className={`${styles.marker} ${index === current ? styles.current : null}`}
              onClick={() => setCurrent(index)}
            />
          );
        })}
      </ul>
    </FadePresence>
  );
};

export default Slideshow;
