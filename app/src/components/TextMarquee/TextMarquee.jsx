import { useState, useEffect, useRef } from "react";
import styles from "./TextMarquee.module.css";
import { motion } from "framer-motion";

import { calculateTextWidth } from "@/helpers/calculateTextWidth";

const TextMarquee = ({ text, mediaWidth, fontSize }) => {
  const marqueeInner = useRef(null);
  const [marqueeInnerWidth, setMarqueeInnerWidth] = useState(null);

  const [textWidth, setTextWidth] = useState(calculateTextWidth(text, `${fontSize}px`));

  const [shouldScroll, setShouldScroll] = useState(null);

  useEffect(() => {
    setMarqueeInnerWidth(marqueeInner.current.scrollWidth + 6);
  }, [shouldScroll, text, mediaWidth]);

  useEffect(() => {
    if (!mediaWidth || marqueeInnerWidth === 0) return undefined;

    // console.log("textWidth:", textWidth, "marqueeOuterWidth:", marqueeOuterWidth);
    setShouldScroll(textWidth > mediaWidth);
  }, [marqueeInnerWidth, mediaWidth, textWidth]);

  return (
    <div className={styles.marquee_outer}>
      <motion.div
        ref={marqueeInner}
        className={styles.marquee_inner}
        animate={shouldScroll ? { x: ["0%", -marqueeInnerWidth / 2] } : {}}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: 40,
          },
        }}
      >
        {Array(shouldScroll ? 4 : 1)
          .fill(text)
          .map((_, index) => (
            <div style={{ width: shouldScroll && "fit-content", marginRight: shouldScroll && "6px" }} key={index}>
              {text}
            </div>
          ))}
      </motion.div>
    </div>
  );
};

export default TextMarquee;
