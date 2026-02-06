import { useState, useEffect, useRef } from "react";
import styles from "./TextMarquee.module.css";
import { motion } from "framer-motion";

import { calculateTextWidth } from "@/helpers/calculateTextWidth";

const TextMarquee = ({ text, mediaWidth, fontSize, isActive, className, setIsOverflowing }) => {
  const marqueeInner = useRef(null);
  const measureRef = useRef(null);
  const [marqueeInnerWidth, setMarqueeInnerWidth] = useState(null);

  const [textWidth, setTextWidth] = useState(0);

  const [shouldScroll, setShouldScroll] = useState(null);

  useEffect(() => {
    setMarqueeInnerWidth(marqueeInner.current.scrollWidth + 12);
  }, [shouldScroll, text, mediaWidth]);

  useEffect(() => {
    if (!measureRef.current) return;
    const width = measureRef.current.scrollWidth;
    setTextWidth(width);
  }, [text, fontSize]);

  useEffect(() => {
    if (!isActive) return; // isActive is needed for the Copyright in the Satellite, to calculate position when the image lands
    if (!mediaWidth || marqueeInnerWidth === 0) return undefined;

    setShouldScroll(textWidth > mediaWidth);
  }, [marqueeInnerWidth, mediaWidth, textWidth, isActive]);

  useEffect(() => {
    if (!setIsOverflowing) return;
    shouldScroll ? setIsOverflowing(true) : setIsOverflowing(false);
  }, [shouldScroll]);

  return (
    <>
      <div
        className={`MEASURE ${shouldScroll ? styles.isOverflowing : ""}`}
        ref={measureRef}
        style={{
          height: "100%",
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          width: "fit-content",

          // ⚠️ These two were added for mobile — If it breaks, make mobile only
          maxWidth: "calc(100% - 6px)",
          overflowX: "hidden",
        }}
      >
        {text}
      </div>
      <div className={`${className} ${styles.marquee_outer}`} style={{ height: "100%" }}>
        {/* This monstrosity is to handle Slideshow changes. The component doesn't unmount during slideshow changes, so, a manual jump back to the new Image's Copyright starting position is necessary. (Especially without an animation.)   */}
        <motion.div
          ref={marqueeInner}
          className={styles.marquee_inner}
          animate={
            shouldScroll ? { x: ["0%", -marqueeInnerWidth / 2] } : { x: 0, transition: { duration: 0 } } // 👈 snap back instantly
          }
          style={{ display: shouldScroll && "flex", height: "100%" }}
          transition={
            shouldScroll
              ? {
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                    duration: 40,
                  },
                }
              : undefined
          }
        >
          {Array(shouldScroll ? 4 : 1)
            .fill(text)
            .map((_, index) => (
              <div
                className={`${shouldScroll ? styles.isOverflowing : ""} ${styles.marqueeText}`}
                style={{ width: shouldScroll && "fit-content", marginRight: shouldScroll && "6px" }}
                key={index}
              >
                {text}
              </div>
            ))}
        </motion.div>
      </div>
    </>
  );
};

export default TextMarquee;
