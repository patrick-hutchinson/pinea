import { useContext, useEffect, useRef, useState } from "react";

import { DimensionsContext } from "@/context/DimensionsContext";
import { AnimatePresence, motion } from "framer-motion";
import { StateContext } from "@/context/StateContext";

import BlurPlaceholder from "@/components/BlurMedia/BlurMedia";
import ShrinkMedia from "@/components/ShrinkMedia/ShrinkMedia";
import Label from "@/components/Label/Label";
import ShareButton from "../Buttons/ShareButton";

import styles from "./Showcase.module.css";

const ShrinkShowcase = ({ caption, medium, className, storyType, path, showShare }) => {
  const { isMobile } = useContext(StateContext);
  const [isHovered, setIsHovered] = useState(false);
  const { deviceDimensions } = useContext(DimensionsContext);

  const [isActive, setIsActive] = useState(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useRef(null);

  useEffect(() => {
    setIsActive(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const containerHeight = containerRef.current.getBoundingClientRect().height;

    setContainerDimensions({ width: containerWidth, height: containerHeight });
  }, [deviceDimensions]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BlurPlaceholder className={className} medium={medium}>
        <ShrinkMedia
          medium={medium}
          caption={caption}
          isActive={isActive}
          externalHoverActive={isHovered}
          className={styles.preview}
          path={path}
          containerDimensions={containerDimensions}
        />
        {storyType && <Label className={styles.label}>{storyType}</Label>}
      </BlurPlaceholder>

      <AnimatePresence>
        {showShare && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: isHovered || isMobile ? 1 : 0 }} exit={{ opacity: 0 }}>
            <ShareButton className={styles.shareButton} url={path} />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShrinkShowcase;
