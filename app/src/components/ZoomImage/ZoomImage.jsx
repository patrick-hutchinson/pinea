"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import Media from "../Media/Media";

import styles from "./ZoomImage.module.css";

const ZoomImage = ({ feature }) => {
  const container = useRef(null);
  const isInView = useInView(container, { amount: 0.8 });

  const mediaVariants = {
    offscreen: { scale: 1, transition: "easeInOut" },
    onscreen: { scale: 1.2, transition: "easeInOut" },
  };

  const textVariants = {
    offscreen: { opacity: 0, transition: "easeInOut" },
    onscreen: { opacity: 1, transition: "easeInOut" },
  };

  return (
    <motion.figure ref={container} className={styles.container}>
      <motion.div
        className={styles.media_container}
        initial="offscreen"
        animate={isInView ? "onscreen" : "offscreen"}
        variants={mediaVariants}
      >
        <Media medium={feature.thumbnail} />
      </motion.div>
      <motion.figcaption
        typo="h2"
        initial="offscreen"
        animate={isInView ? "onscreen" : "offscreen"}
        variants={textVariants}
        style={{
          position: "absolute",
          zIndex: 2,
          textAlign: "center",
          mixBlendMode: "exclusion",
          color: "#fff",
        }}
      >
        <div>{feature.title}</div>
        <p>
          {feature.author} <i>({feature.nationality})</i>
        </p>
      </motion.figcaption>
    </motion.figure>
  );
};
export default ZoomImage;
