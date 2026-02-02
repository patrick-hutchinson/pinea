import { useEffect, useRef, useState } from "react";

import TextMarquee from "@/components/TextMarquee/TextMarquee";

import styles from "./Copyright.module.css";

const Copyright = ({ copyright = "", mediaWidth, activeElement, isActive, className, isVideo }) => {
  return (
    <div className={`${className} ${styles.copyrightContainer}`} typo="h5">
      <div className={styles.copyrightText}>
        <TextMarquee
          text={copyright}
          mediaWidth={mediaWidth}
          activeElement={activeElement}
          fontSize={8}
          isActive={isActive}
          isVideo={isVideo}
        />
      </div>
    </div>
  );
};

export default Copyright;
