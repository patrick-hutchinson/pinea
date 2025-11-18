"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { translate } from "@/helpers/translate";

import Media from "@/components/Media/Media";

import styles from "./ScrollRevealFigure.module.css";

const ScrollRevealFigure = ({ item }) => {
  console.log(item, "review");
  const container = useRef(null);
  const isInView = useInView(container, { amount: 0.8 });

  const textVariants = {
    offscreen: { opacity: 0, transition: "easeInOut" },
    onscreen: { opacity: 1, transition: "easeInOut" },
  };

  return (
    <motion.figure ref={container} className={styles.container}>
      <div className={styles.media_container}>
        <Media medium={item.cover.medium} />
      </div>
      <motion.figcaption
        typo="h2"
        initial="offscreen"
        animate={isInView ? "onscreen" : "offscreen"}
        variants={textVariants}
        style={{
          position: "absolute",
          zIndex: 2,
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div>{translate(item.title)}</div>
      </motion.figcaption>
    </motion.figure>
  );
};
export default ScrollRevealFigure;
