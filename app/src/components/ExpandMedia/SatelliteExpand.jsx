import { motion } from "framer-motion";
import Media from "@/components/Media/Media";

import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";
import { DimensionsContext } from "@/context/DimensionsContext";

import FullscreenPreview from "../FullscreenPreview/FullscreenPreview";

const parseAspectRatio = (medium) => {
  if (!medium) return 1;

  if (medium.type === "image") {
    if (Number.isFinite(medium.width) && Number.isFinite(medium.height) && medium.height > 0) {
      return medium.width / medium.height;
    }
    return 1;
  }

  if (medium.type === "video" && typeof medium.aspect_ratio === "string" && medium.aspect_ratio.includes(":")) {
    const [w, h] = medium.aspect_ratio.split(":").map(Number);
    if (Number.isFinite(w) && Number.isFinite(h) && h > 0) return w / h;
  }

  if (Number.isFinite(medium.width) && Number.isFinite(medium.height) && medium.height > 0) {
    return medium.width / medium.height;
  }

  return 1;
};

const SatelliteExpand = ({ medium, copyright, activeElement, hasLanded, isHolding, loadEager, isActive = true }) => {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [measuredMediaWidth, setMeasuredMediaWidth] = useState(0);
  const [isWidthSettled, setIsWidthSettled] = useState(false);

  const [isHovering, setIsHovering] = useState(false);
  const maxHeight = 600;
  const initialScale = (maxHeight - 80) / maxHeight; // 0.867
  const { isSafari, isMobile } = useContext(StateContext);
  const { deviceDimensions } = useContext(DimensionsContext);

  const [isInPlace, setIsInPlace] = useState(false);

  useEffect(() => {
    setIsInPlace(hasLanded && isHovering === true);
  }, [hasLanded, isHovering]);

  useEffect(() => {
    if (!hasLanded || !measuredMediaWidth) {
      setIsWidthSettled(false);
      return undefined;
    }

    // Wait one short settle window after landing + width read
    // so marquee decides only once with final dimensions.
    const timeoutId = setTimeout(() => setIsWidthSettled(true), 140);
    return () => clearTimeout(timeoutId);
  }, [hasLanded, measuredMediaWidth]);

  const marqueeReady = hasLanded && isWidthSettled;

  const isImage = medium.type === "image";
  const aspectRatio = parseAspectRatio(medium);

  const maxMediaWidth = isMobile ? 300 : 550;
  const maxMediaHeight = isMobile ? 600 : 600;
  let mediaWidth, mediaHeight;

  if (aspectRatio > 1) {
    // Landscape
    mediaWidth = `${maxMediaWidth}px`;
    mediaHeight = maxMediaHeight / aspectRatio + "px";
  } else if (aspectRatio < 1) {
    // Portrait
    mediaHeight = `${maxMediaHeight}px`;
    mediaWidth = maxMediaWidth * aspectRatio + "px";
  } else {
    // Square
    mediaWidth = mediaHeight = `${maxMediaWidth}px`;
  }

  return (
    <>
      <motion.div
        initial={{ scale: initialScale }}
        animate={{ scale: isInPlace && !isHolding ? 1 : initialScale }}
        onHoverStart={() => hasLanded && setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        onClick={() => isMobile && setShowFullscreen(true)}
        style={{
          zIndex: 2,
          display: "flex",
          pointerEvents: hasLanded ? "all" : "none",
          maxHeight: isSafari ? maxMediaHeight : "80%",
          maxWidth: isSafari ? maxMediaWidth : null,
          width: isSafari ? mediaWidth : isImage ? "auto" : mediaWidth,
          height: isSafari ? "auto" : "auto",
        }}
      >
        <Media
          loadEager={loadEager}
          medium={medium}
          copyright={!isMobile && marqueeReady ? copyright : null}
          activeElement={activeElement}
          isActive={isActive}
          objectFit="contain"
          onWidth={setMeasuredMediaWidth}
          disableTapCopyright={isMobile}
        />
      </motion.div>

      {showFullscreen && (
        <FullscreenPreview
          medium={medium}
          showFullscreen={showFullscreen}
          setShowFullscreen={setShowFullscreen}
          copyright={copyright}
        />
      )}
    </>
  );
};

export default SatelliteExpand;
