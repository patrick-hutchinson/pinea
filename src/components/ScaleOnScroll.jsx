"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import Media from "./Media";

const ScaleOnScroll = ({ feature }) => {
  const container = useRef(null);
  const isInView = useInView(container, { amount: 0.8 });

  const variants = {
    offscreen: { scale: 1, transition: "easeInOut" },
    onscreen: { scale: 1.2, transition: "easeInOut" },
  };

  return (
    <motion.figure
      ref={container}
      style={{
        width: "100%",
        height: "auto",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        style={{ width: "100%", height: "auto" }}
        initial="offscreen"
        animate={isInView ? "onscreen" : "offscreen"}
        variants={variants}
      >
        <Media medium={feature.thumbnail} />
      </motion.div>
      <motion.figcaption
        className="ff2"
        style={{ position: "absolute", zIndex: 2, textAlign: "center", mixBlendMode: "exclusion", color: "#fff" }}
      >
        <h2>{feature.title}</h2>
        <p>
          {feature.author} <i>({feature.nationality})</i>
        </p>
      </motion.figcaption>
    </motion.figure>
  );
};
export default ScaleOnScroll;
