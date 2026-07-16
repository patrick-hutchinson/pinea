import { motion } from "framer-motion";
import Media from "@/components/Media/Media";

import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";

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

const SatelliteExpand = ({ medium, copyright, activeElement, hasLanded, isHolding, loadEager }) => {
  const [showFullscreen, setShowFullscreen] = useState(false);

  const [isHoverScaleComplete, setIsHoverScaleComplete] = useState(false);
  const maxHeight = 600;
  const initialScale = (maxHeight - 80) / maxHeight; // 0.867
  const { isSafari, isMobile } = useContext(StateContext);

  const shouldScaleToFull = hasLanded && !isHolding;

  useEffect(() => {
    if (!shouldScaleToFull) {
      setIsHoverScaleComplete(false);
    }
  }, [shouldScaleToFull]);

  const showCopyright = hasLanded && (isMobile || isHoverScaleComplete);

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
        animate={{ scale: shouldScaleToFull ? 1 : initialScale }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onAnimationComplete={() => {
          if (shouldScaleToFull) setIsHoverScaleComplete(true);
        }}
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
          copyright={showCopyright ? copyright : null}
          activeElement={activeElement}
          isActive={showCopyright}
          forceCopyrightVisible={showCopyright}
          objectFit="contain"
          disableTapCopyright={isMobile}
        />
      </motion.div>

      <FullscreenPreview
        medium={medium}
        showFullscreen={showFullscreen}
        setShowFullscreen={setShowFullscreen}
        copyright={copyright}
      />
    </>
  );
};

export default SatelliteExpand;
