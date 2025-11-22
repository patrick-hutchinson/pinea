import { motion } from "framer-motion";
import Media from "@/components/Media/Media";

import { useEffect, useState } from "react";

const SatelliteExpand = ({ medium, copyright, activeElement, hasLanded, isHolding }) => {
  const [isHovering, setIsHovering] = useState(false);
  const maxHeight = 600;
  const initialScale = (maxHeight - 80) / maxHeight; // 0.867

  const [isInPlace, setIsInPlace] = useState(false);

  useEffect(() => {
    setIsInPlace(hasLanded && isHovering === true);
  }, [hasLanded, isHovering]);

  useEffect(() => {
    console.log(hasLanded, "hasLanded");
  }, [hasLanded]);

  useEffect(() => {
    console.log(isInPlace, "isInPlace");
  }, [isInPlace]);

  return (
    <>
      <motion.div
        initial={{ scale: initialScale }}
        animate={{ scale: isInPlace && !isHolding ? 1 : initialScale }}
        onHoverStart={() => hasLanded && setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        style={{
          maxHeight: "90%",
          zIndex: 2,
          display: "flex",
          pointerEvents: hasLanded ? "all" : "none",
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
