import { motion } from "framer-motion";
import Media from "@/components/Media/Media";

import { useEffect, useState, useContext } from "react";

import { StateContext } from "@/context/StateContext";

const ExpandMedia = ({
  medium,
  copyright,
  activeElement,
  isActive,
  hasLanded,
  className,
  containerDimensions,
  cropMultiplier,
  expandMedia = true,
  style,
}) => {
  const { isSafari } = useContext(StateContext);
  const [isHovering, setIsHovering] = useState(false);
  const maxHeight = 600;
  const initialScale = (maxHeight - 80) / maxHeight; // 0.867
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    setShouldScroll(isActive !== undefined ? isActive : hasLanded && isHovering);
  }, [hasLanded, isActive, isHovering]);

  const factor = cropMultiplier ?? 0.8;

  const isImage = medium.type === "image";
  const isVideo = medium.type === "video";

  let aspectRatio;

  if (isImage) aspectRatio = medium.width / medium.height;
  if (isVideo) {
    const [aspectWidth, aspectHeight] = medium.aspect_ratio.split(":");
    aspectRatio = aspectWidth / aspectHeight;
  }

  const maxMediaWidth = containerDimensions?.width * factor;
  const maxMediaHeight = containerDimensions?.height * factor;

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
        className={className}
        initial={{ scale: initialScale }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        whileHover={{
          scale: expandMedia ? 1 : initialScale,
          transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1], // material-like
          },
        }}
        style={{
          maxHeight: "90%",
          zIndex: 2,
          display: "flex",
          // height: "auto",
          // width: isSafari ? "100%" : "auto",
          maxHeight: isSafari ? maxMediaHeight : "80%",
          maxWidth: isSafari ? maxMediaWidth : null,
          width: isSafari ? mediaWidth : isImage ? "auto" : mediaWidth,
          height: isSafari ? "auto" : "auto",
          ...style,
        }}
      >
        <Media
          medium={medium}
          copyright={copyright}
          activeElement={activeElement}
          isActive={shouldScroll}
          objectFit="contain"
        />
      </motion.div>
    </>
  );
};

export default ExpandMedia;
