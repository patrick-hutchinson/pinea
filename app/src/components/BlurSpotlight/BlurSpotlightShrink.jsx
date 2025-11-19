import BlurPlaceholder from "@/components/BlurMedia/BlurMedia";
import ShrinkMedia from "@/components/ShrinkMedia/ShrinkMedia";
import { useEffect, useRef, useState } from "react";

import styles from "./BlurSpotlight.module.css";

const BlurSpotlightShrink = ({ caption, medium, className, storyType }) => {
  const [isActive, setIsActive] = useState(null);

  useEffect(() => {
    setIsActive(true);
  }, []);

  return (
    <BlurPlaceholder className={className} medium={medium}>
      <div
        style={{
          zIndex: 1,
          position: "absolute",
          maxWidth: "80%",
          maxHeight: "80%",
          width: "auto",
          height: "80%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <ShrinkMedia medium={medium} caption={caption} isActive={isActive} className={styles.preview} />
      </div>
      {storyType && (
        <p
          style={{
            position: "absolute",
            bottom: "var(--margin)",
            left: "var(--margin)",
            color: "#fff",
            textTransform: "capitalize",
          }}
          className={styles.type}
          typo="h4"
        >
          {storyType}
        </p>
      )}
    </BlurPlaceholder>
  );
};

export default BlurSpotlightShrink;
