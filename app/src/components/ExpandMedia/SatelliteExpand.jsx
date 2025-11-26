import { motion } from "framer-motion";
import Media from "@/components/Media/Media";

import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";

import styles from "./ExpandMedia.module.css";

const SatelliteExpand = ({ medium, copyright, activeElement, hasLanded, isHolding }) => {
  const [isHovering, setIsHovering] = useState(false);
  const maxHeight = 600;
  const initialScale = (maxHeight - 80) / maxHeight; // 0.867
  const { isSafari } = useContext(StateContext);

  const [isInPlace, setIsInPlace] = useState(false);

  useEffect(() => {
    setIsInPlace(hasLanded && isHovering === true);
    console.log(medium.width, "width");
    console.log(medium.height, "height");
    console.log(medium.aspectRatio, "aspect");
  }, [hasLanded, isHovering]);

  const aspectRatio = medium.width / medium.height;

  let imageWidth, imageHeight;

  if (aspectRatio > 1) {
    // Landscape
    imageWidth = "550px";
    imageHeight = 550 / aspectRatio + "px";
  } else if (aspectRatio < 1) {
    // Portrait
    imageHeight = "550px";
    imageWidth = 550 * aspectRatio + "px";
  } else {
    // Square
    imageWidth = imageHeight = "550px";
  }

  return (
    <>
      <motion.div
        initial={{ scale: initialScale }}
        animate={{ scale: isInPlace && !isHolding ? 1 : initialScale }}
        onHoverStart={() => hasLanded && setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        style={{
          maxHeight: "80%",
          zIndex: 2,
          display: "flex",
          pointerEvents: hasLanded ? "all" : "none",
          // height: "auto",

          width: isSafari ? imageWidth : "auto",
          height: isSafari ? imageHeight : "auto",

          // height: isSafari
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
