import { useEffect, useRef, useState } from "react";
import styles from "./Media.module.css";
import TextMarquee from "@/components/TextMarquee/TextMarquee";

const Copyright = ({ copyright = "", mediaWidth, activeElement, isActive, className }) => {
  useEffect(() => {}, [mediaWidth]);
  return (
    <div className={`${className} ${styles.copyright}`} typo="h5" style={{ height: "10px" }}>
      <div className={styles.copyright_text} style={{ width: "100%", height: "100%" }}>
        <TextMarquee
          text={copyright}
          mediaWidth={mediaWidth}
          activeElement={activeElement}
          fontSize={8}
          isActive={isActive}
        />
      </div>
    </div>
  );
};

export default Copyright;
