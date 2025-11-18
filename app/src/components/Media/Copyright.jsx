import { useEffect, useRef, useState } from "react";
import styles from "./Media.module.css";
import TextMarquee from "@/components/TextMarquee/TextMarquee";

const Copyright = ({ copyright = "", mediaWidth, activeElement, isActive }) => {
  useEffect(() => {
    console.log(mediaWidth, "mediaWidth");
  }, [mediaWidth]);
  return (
    <div className={styles.copyright} typo="h5">
      <div className={styles.copyright_text} style={{ width: "100%" }}>
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
