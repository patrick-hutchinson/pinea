import BlurPlaceholder from "@/components/BlurMedia/BlurMedia";
import ShrinkMedia from "@/components/ShrinkMedia/ShrinkMedia";
import { useEffect, useRef, useState } from "react";
import Label from "@/components/Label/Label";

import { motion } from "framer-motion";

import styles from "./BlurSpotlight.module.css";

const BlurSpotlightShrink = ({ caption, medium, className, storyType }) => {
  const [isHovered, setIsHovered] = useState(null);
  const [isActive, setIsActive] = useState(null);

  useEffect(() => {
    setIsActive(true);
  }, []);

  return (
    <BlurPlaceholder
      className={className}
      medium={medium}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
      {storyType && <Label className={styles.label}>{storyType}</Label>}
    </BlurPlaceholder>
  );
};

export default BlurSpotlightShrink;
