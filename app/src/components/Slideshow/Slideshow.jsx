import { useState, useEffect } from "react";
import Media from "@/components/Media/Media";

import styles from "./Slideshow.module.css";
import FadePresence from "../Animation/FadePresence";

const Slideshow = ({ images }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [images.length]);

  return (
    <FadePresence className={styles.container} motionKey={images[current].url}>
      <Media medium={images[current]} />

      <ul className={styles.marker_wrapper}>
        {images.map((_, index) => {
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
