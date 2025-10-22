import { useEffect, useRef, useState } from "react";
import styles from "./Media.module.css";
import TextMarquee from "@/components/TextMarquee/TextMarquee";

const Copyright = ({ copyright = "", isLoaded }) => {
  return (
    <div
      className={styles.copyright}
      typo="h5"
      style={{ position: "absolute", bottom: 8, left: 8, color: "#fff", width: "100%" }}
    >
      ©
      <div className={styles.copyright_text} style={{ width: "100%" }}>
        <TextMarquee text={copyright} isLoaded={isLoaded} />
      </div>
    </div>
  );
};

export default Copyright;
