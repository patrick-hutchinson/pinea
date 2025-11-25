import { motion } from "framer-motion";
import Media from "@/components/Media/Media";

import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";

const SatelliteExpand = ({ medium, copyright, activeElement, hasLanded, isHolding }) => {
  const [isHovering, setIsHovering] = useState(false);
  const maxHeight = 600;
  const initialScale = (maxHeight - 80) / maxHeight; // 0.867
  const { isSafari } = useContext(StateContext);

  const [isInPlace, setIsInPlace] = useState(false);

  useEffect(() => {
    setIsInPlace(hasLanded && isHovering === true);
  }, [hasLanded, isHovering]);

  // useEffect(() => {
  //   console.log(hasLanded, "hasLanded");
  // }, [hasLanded]);

  // useEffect(() => {
  //   console.log(isInPlace, "isInPlace");
  // }, [isInPlace]);

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
          height: "auto",
          // width: `${medium.width}px`,
          width: isSafari ? `550px` : null,
          maxWidth: "100%",
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
