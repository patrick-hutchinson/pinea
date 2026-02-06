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
  console.log(aspectRatio, "aspectRatio");
  if (isVideo) {
    const [aspectWidth, aspectHeight] = medium.aspect_ratio.split(":");
    aspectRatio = aspectWidth / aspectHeight;
  }

  const maxMediaWidth = containerDimensions?.width * factor;
  const maxMediaHeight = containerDimensions?.height * factor;

  console.log(containerDimensions?.width, factor, cropMultiplier, "expandmedia");

  let mediaWidth, mediaHeight;

  if (!aspectRatio) return { width: 0, height: 0 };

  const naturalWidth = aspectRatio > 1 ? 1 : aspectRatio; // just ratios
  const naturalHeight = aspectRatio > 1 ? 1 / aspectRatio : 1;

  const scale = Math.min(maxMediaWidth / naturalWidth, maxMediaHeight / naturalHeight);

  mediaWidth = naturalWidth * scale;
  mediaHeight = naturalHeight * scale;

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
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1], // material-like
          },
        }}
        style={{
          zIndex: 2,
          width: mediaWidth,
          height: mediaHeight,
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
