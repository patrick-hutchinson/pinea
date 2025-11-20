"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { translate } from "@/helpers/translate";

import Media from "@/components/Media/Media";
import Text from "@/components/Text/Text";

import styles from "./ScrollRevealFigure.module.css";

const ScrollRevealFigure = ({ item }) => {
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
        <Media medium={item.cover.medium} />
      </motion.div>

      <motion.figcaption
        typo="h2"
        initial="offscreen"
        className={styles.title}
        animate={isInView ? "onscreen" : "offscreen"}
        variants={textVariants}
        style={{
          position: "absolute",
          zIndex: 2,
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Text text={translate(item.title)} />
      </motion.figcaption>
    </motion.figure>
  );
};
export default ScrollRevealFigure;
