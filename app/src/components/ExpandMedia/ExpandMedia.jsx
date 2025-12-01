import { motion } from "framer-motion";
import Media from "@/components/Media/Media";

import { useEffect, useState, useContext } from "react";
import { StateContext } from "@/context/StateContext";

const ExpandMedia = ({ medium, copyright, activeElement, isActive, hasLanded, className, containerDimensions }) => {
  const { isSafari } = useContext(StateContext);

  const [isHovering, setIsHovering] = useState(false);
  const maxHeight = 600;
  const initialScale = (maxHeight - 80) / maxHeight; // 0.867
  const [isInPlace, setIsInPlace] = useState(false);

  useEffect(() => {
    setIsInPlace(isActive !== undefined ? isActive : hasLanded && isHovering === true);
  }, [hasLanded, isActive, isHovering]);

  useEffect(() => {
    console.log(hasLanded, "hasLanded");
  }, [hasLanded]);

  useEffect(() => {
    console.log(isInPlace, "isInPlace");
  }, [isInPlace]);

  // const Wrapper = path ? Link : "div";
  // const wrapperProps = path ? { href: path } : {};

  const aspectRatio = medium.width / medium.height;

  const maxImageWidth = containerDimensions?.width * 0.8;
  const maxImageHeight = containerDimensions?.height * 0.6;

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
        animate={{ scale: isInPlace ? 1 : initialScale }}
        onHoverStart={() => hasLanded && setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        style={{
          zIndex: 2,
          display: "flex",
          pointerEvents: hasLanded ? "all" : "none",

          maxHeight: maxImageHeight,
          maxWidth: maxImageWidth,
          width: imageWidth,
          height: imageHeight,
        }}
      >
        <Media
          medium={medium}
          copyright={copyright}
          activeElement={activeElement}
          isActive={isInPlace}
          objectFit="contain"
        />
      </motion.div>
    </>
  );
};

export default ExpandMedia;
