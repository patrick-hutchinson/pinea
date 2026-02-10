import { motion } from "framer-motion";
import Media from "@/components/Media/Media";

import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";
import { DimensionsContext } from "@/context/DimensionsContext";

import FullscreenPreview from "../FullscreenPreview/FullscreenPreview";

const SatelliteExpand = ({ medium, copyright, activeElement, hasLanded, isHolding, loadEager }) => {
  const [showFullscreen, setShowFullscreen] = useState(false);

  const [isHovering, setIsHovering] = useState(false);
  const maxHeight = 600;
  const initialScale = (maxHeight - 80) / maxHeight; // 0.867
  const { isSafari, isMobile } = useContext(StateContext);
  const { deviceDimensions } = useContext(DimensionsContext);

  const [isInPlace, setIsInPlace] = useState(false);

  useEffect(() => {
    setIsInPlace(hasLanded && isHovering === true);
  }, [hasLanded, isHovering]);

  const isImage = medium.type === "image";
  const isVideo = medium.type === "video";

  let aspectRatio;

  if (isImage) aspectRatio = medium.width / medium.height;
  if (isVideo) {
    const [aspectWidth, aspectHeight] = medium.aspect_ratio.split(":");
    aspectRatio = aspectWidth / aspectHeight;
  }

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
          copyright={copyright}
          activeElement={activeElement}
          isActive={hasLanded}
          objectFit="contain"
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
