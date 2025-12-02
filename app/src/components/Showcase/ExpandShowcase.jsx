import BlurPlaceholder from "@/components/BlurMedia/BlurMedia";
import CalendarExpandMedia from "@/components/ExpandMedia/CalendarExpandMedia";

import FullscreenPreview from "@/components/FullscreenPreview/FullscreenPreview";
import { StateContext } from "@/context/StateContext";

import styles from "./Showcase.module.css";
import { useContext, useRef, useState, useEffect } from "react";

const ExpandShowcase = ({ caption, medium, className, storyType }) => {
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const { isMobile } = useContext(StateContext);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const containerHeight = containerRef.current.getBoundingClientRect().height;

    setContainerDimensions({ width: containerWidth, height: containerHeight });
  }, []);

  return (
    <>
      <BlurPlaceholder className={`${className} ${styles.showcase_image}`} medium={medium}>
        <div
          ref={containerRef}
          onClick={() => isMobile && setShowFullscreen(true)}
          style={{
            zIndex: 1,
            position: "absolute",
            maxWidth: !isMobile && "80%",
            maxHeight: !isMobile && "80%",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CalendarExpandMedia
            medium={medium}
            copyright={caption}
            isActive={true}
            containerDimensions={containerDimensions}
            cropMultiplier={1}
          />
        </div>
        {storyType && (
          <p style={{ position: "absolute", bottom: "var(--margin)", left: "var(--margin)", color: "#fff" }} typo="h4">
            {storyType}
          </p>
        )}
      </BlurPlaceholder>

      {showFullscreen && (
        <FullscreenPreview
          medium={medium}
          showFullscreen={showFullscreen}
          setShowFullscreen={setShowFullscreen}
          copyright={caption}
        />
      )}
    </>
  );
};

export default ExpandShowcase;
