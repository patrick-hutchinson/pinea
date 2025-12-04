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
  style,
}) => {
  const { isSafari } = useContext(StateContext);
  const [isHovering, setIsHovering] = useState(false);
  const maxHeight = 600;
  const initialScale = (maxHeight - 80) / maxHeight; // 0.867
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    setShouldScroll(isActive !== undefined ? isActive : hasLanded && isHovering);
  }, [hasLanded, isActive]);

  const aspectRatio = medium.width / medium.height;

  const factor = cropMultiplier || 0.8;

  const maxImageWidth = containerDimensions?.width * factor;
  const maxImageHeight = containerDimensions?.height * factor;

  let imageWidth, imageHeight;

  let wFromWidth = maxImageWidth;
  let hFromWidth = maxImageWidth / aspectRatio;

  let hFromHeight = maxImageHeight;
  let wFromHeight = maxImageHeight * aspectRatio;

  if (hFromWidth <= maxImageHeight) {
    imageWidth = `${wFromWidth}px`;
    imageHeight = `${hFromWidth}px`;
  } else {
    imageWidth = `${wFromHeight}px`;
    imageHeight = `${hFromHeight}px`;
  }

  return (
    <>
      <motion.div
        className={className}
        initial={{ scale: initialScale }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        whileHover={{ scale: 1, transition: { duration: 0.2 } }}
        style={{
          maxHeight: "90%",
          zIndex: 2,
          display: "flex",
          height: "auto",
          width: isSafari ? "100%" : "auto",
          maxHeight: maxImageHeight,
          maxWidth: maxImageWidth,
          width: imageWidth,
          height: imageHeight,
          ...style,
          // width: "100%", height: "auto"
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
