"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import Media from "../Media";

import styles from "./ZoomImage.module.css";

const ZoomImage = ({ feature }) => {
  const container = useRef(null);
  const isInView = useInView(container, { amount: 0.8 });

  const variants = {
    offscreen: { scale: 1, transition: "easeInOut" },
    onscreen: { scale: 1.2, transition: "easeInOut" },
  };

  return (
    <motion.figure ref={container} className={styles.container}>
      <motion.div
        className={styles.media_container}
        initial="offscreen"
        animate={isInView ? "onscreen" : "offscreen"}
        variants={variants}
      >
        <Media medium={feature.thumbnail} />
      </motion.div>
      <motion.figcaption
        style={{
          position: "absolute",
          zIndex: 2,
          textAlign: "center",
          mixBlendMode: "exclusion",
          color: "#fff",
          fontSize: "calc(var(--font-size-l))",
          lineHeight: "var(--line-height-l)",
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
