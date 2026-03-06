import { useState } from "react";

import TextMarquee from "@/components/TextMarquee/TextMarquee";
import { useMarqueeState } from "@/components/TextMarquee/useMarqueeState";

import styles from "./Copyright.module.css";

const Copyright = ({ copyright = "", mediaWidth, activeElement, isActive, className, isVideo, isHovered, isTapped }) => {
  const [isOverflowing, setIsOverflowing] = useState(null);
  const isVisible = Boolean(isHovered || isTapped);
  const marqueeState = useMarqueeState({
    text: copyright,
    mediaWidth,
    isActive,
    fontSize: 8,
  });

  return (
    <div
      className={`${className} ${styles.copyrightContainer} ${isOverflowing ? styles.isOverflowing : ""} ${
        isVisible ? styles.isHovered : ""
      }`}
      typo="h5"
    >
      <div className={styles.copyrightText}>
        <TextMarquee
          text={copyright}
          mediaWidth={mediaWidth}
          activeElement={activeElement}
          fontSize={8}
          isActive={isActive}
          isVideo={isVideo}
          setIsOverflowing={setIsOverflowing}
          marqueeState={marqueeState}
        />
      </div>
    </div>
  );
};

export default Copyright;
