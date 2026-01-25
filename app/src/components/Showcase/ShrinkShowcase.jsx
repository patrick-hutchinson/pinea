import BlurPlaceholder from "@/components/BlurMedia/BlurMedia";
import ShrinkMedia from "@/components/ShrinkMedia/ShrinkMedia";
import { useContext, useEffect, useRef, useState } from "react";
import Label from "@/components/Label/Label";

import styles from "./Showcase.module.css";

import { DimensionsContext } from "@/context/DimensionsContext";

const ShrinkShowcase = ({ caption, medium, className, storyType, path }) => {
  const { deviceDimensions } = useContext(DimensionsContext);
  const [isHovered, setIsHovered] = useState(null);
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
    <div ref={containerRef} className={className} style={{ position: "relative" }}>
      <BlurPlaceholder
        className={className}
        medium={medium}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ShrinkMedia
          medium={medium}
          caption={caption}
          isActive={isActive}
          className={styles.preview}
          path={path}
          containerDimensions={containerDimensions}
        />
        {storyType && <Label className={styles.label}>{storyType}</Label>}
      </BlurPlaceholder>
    </div>
  );
};

export default ShrinkShowcase;
