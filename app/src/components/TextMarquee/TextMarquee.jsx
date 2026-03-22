import { useEffect, useRef } from "react";
import styles from "./TextMarquee.module.css";
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
        <div
          ref={marqueeInner}
          className={`${styles.marquee_inner} ${shouldScroll ? styles.scrolling : ""}`}
          style={{
            display: shouldScroll ? "flex" : undefined,
            height: "100%",
            "--marquee-distance": `${scrollDistance}px`,
            "--marquee-duration": `${duration}s`,
          }}
        >
          {Array(shouldScroll ? 2 : 1)
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
        </div>
      </div>
    </>
  );
};

export default TextMarquee;
