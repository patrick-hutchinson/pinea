import { useState, useEffect, useRef } from "react";
import styles from "./TextMarquee.module.css";
import { motion } from "framer-motion";

import { calculateTextWidth } from "@/helpers/calculateTextWidth";

const TextMarquee = ({ text, isLoaded }) => {
  const marqueeInner = useRef(null);
  const marqueeOuter = useRef(null);

  const [marqueeInnerWidth, setMarqueeInnerWidth] = useState(null);
  const [marqueeOuterWidth, setMarqueeOuterWidth] = useState(null);

  const [textWidth, setTextWidth] = useState(calculateTextWidth(text, "8px"));

  const [shouldScroll, setShouldScroll] = useState(null);

  // ⚠️ The width of the outer container can only be defined, when the image has loaded!
  useEffect(() => {
    setMarqueeInnerWidth(marqueeInner.current.scrollWidth);
    setMarqueeOuterWidth(marqueeOuter.current.getBoundingClientRect().width);
  }, [isLoaded]);

  useEffect(() => {
    if (!marqueeOuterWidth || marqueeInnerWidth === 0) return undefined;
    // console.log("textWidth:", textWidth, "marqueeOuterWidth:", marqueeOuterWidth);
    setShouldScroll(textWidth > marqueeOuterWidth);
  }, [marqueeInnerWidth, marqueeOuterWidth, textWidth]);

  return (
    <div className={styles.marquee_outer} ref={marqueeOuter}>
      <motion.div
        ref={marqueeInner}
        className={styles.marquee_inner}
        animate={shouldScroll ? { x: ["0%", -marqueeInnerWidth / 2] } : {}}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: 20,
          },
        }}
      >
        {Array(shouldScroll ? 4 : 1)
          .fill(text)
          .map((_, index) => (
            <div key={index}>{text}</div>
          ))}
      </motion.div>
    </div>
  );
};

export default TextMarquee;
