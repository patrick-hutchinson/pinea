import { useEffect, useRef } from "react";
import styles from "./TextMarquee.module.css";
import { motion } from "framer-motion";
import { useMarqueeState } from "./useMarqueeState";

const TextMarquee = ({ text, mediaWidth, fontSize, isActive, className, setIsOverflowing, marqueeState }) => {
  const marqueeInner = useRef(null);
  const internalState = useMarqueeState({
    text,
    mediaWidth,
    isActive,
    fontSize,
  });
  const state = marqueeState || internalState;
  const { measureRef, shouldScroll, isOverflowing, scrollDistance, duration, gapPx } = state;

  useEffect(() => {
    if (!setIsOverflowing) return;
    setIsOverflowing(isOverflowing);
  }, [setIsOverflowing, isOverflowing]);

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
          fontSize: fontSize ? `${fontSize}px` : undefined,

          // ⚠️ These two were added for mobile — If it breaks, make mobile only
          maxWidth: "calc(100% - 6px)",
          overflowX: "hidden",
        }}
      >
        {text}
      </div>
      <div className={`${className} ${styles.marquee_outer}`} style={{ height: "100%" }}>
        <motion.div
          ref={marqueeInner}
          className={styles.marquee_inner}
          animate={shouldScroll ? { x: [0, -scrollDistance] } : { x: 0 }}
          style={{ display: shouldScroll && "flex", height: "100%" }}
          transition={
            shouldScroll
              ? {
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear",
                      duration,
                    },
                  }
              : { duration: 0 }
          }
        >
          {Array(shouldScroll ? 4 : 1)
            .fill(text)
            .map((_, index) => (
              <div
                className={`${shouldScroll ? styles.isOverflowing : ""} ${styles.marqueeText}`}
                style={{ width: shouldScroll ? "fit-content" : undefined, marginRight: shouldScroll ? `${gapPx}px` : 0 }}
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
