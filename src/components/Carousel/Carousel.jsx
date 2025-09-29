import { useState, useEffect } from "react";
import Media from "@/components/Media";
import { motion, AnimatePresence } from "framer-motion";

import styles from "./Carousel.module.css";

const Carousel = ({ images }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [images.length]);

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.75 }}
        key={images[current].url}
      >
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
      </motion.div>
    </AnimatePresence>
  );
};

export default Carousel;
