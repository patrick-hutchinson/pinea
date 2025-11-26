import { motion } from "framer-motion";
import Media from "@/components/Media/Media";

import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";

import styles from "./ExpandMedia.module.css";

const SatelliteExpand = ({ medium, copyright, activeElement, hasLanded, isHolding }) => {
  const [isHovering, setIsHovering] = useState(false);
  const maxHeight = 600;
  const initialScale = (maxHeight - 80) / maxHeight; // 0.867
  const { isSafari, isMobile } = useContext(StateContext);

  const [isInPlace, setIsInPlace] = useState(false);

  useEffect(() => {
    setIsInPlace(hasLanded && isHovering === true);
    console.log(medium.width, "width");
    console.log(medium.height, "height");
    console.log(medium.aspectRatio, "aspect");
  }, [hasLanded, isHovering]);

  const aspectRatio = medium.width / medium.height;

  const maxImageWidth = isMobile ? 300 : 550;
  const maxImageHeight = isMobile ? 600 : 600;
  let imageWidth, imageHeight;

  if (aspectRatio > 1) {
    // Landscape
    imageWidth = `${maxImageWidth}px`;
    imageHeight = maxImageHeight / aspectRatio + "px";
  } else if (aspectRatio < 1) {
    // Portrait
    imageHeight = `${maxImageHeight}px`;
    imageWidth = maxImageWidth * aspectRatio + "px";
  } else {
    // Square
    imageWidth = imageHeight = `${maxImageWidth}px`;
  }

  return (
    <>
      <motion.div
        initial={{ scale: initialScale }}
        animate={{ scale: isInPlace && !isHolding ? 1 : initialScale }}
        onHoverStart={() => hasLanded && setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        style={{
          // maxHeight: "80%",
          zIndex: 2,
          display: "flex",
          pointerEvents: hasLanded ? "all" : "none",
          maxHeight: isSafari ? maxImageHeight : "80%",
          maxWidth: isSafari ? maxImageWidth : null,
          width: isSafari ? imageWidth : "auto",
          height: isSafari ? "auto" : "auto",
        }}
      >
        <Media
          medium={medium}
          copyright={copyright}
          activeElement={activeElement}
          isActive={hasLanded}
          objectFit="contain"
        />
      </motion.div>
    </>
  );
};

export default SatelliteExpand;
