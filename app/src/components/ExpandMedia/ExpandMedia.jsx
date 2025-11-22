import { motion } from "framer-motion";
import Media from "@/components/Media/Media";

import { useEffect, useState } from "react";

const ExpandMedia = ({ medium, copyright, activeElement, isActive, hasLanded, objectFit, className }) => {
  const [isHovering, setIsHovering] = useState(false);
  const maxHeight = 600;
  const initialScale = (maxHeight - 80) / maxHeight; // 0.867
  const [isInPlace, setIsInPlace] = useState(false);

  useEffect(() => {
    setIsInPlace(isActive !== undefined ? isActive : hasLanded && isHovering === true);
  }, [hasLanded, isActive, isHovering]);

  useEffect(() => {
    console.log(isInPlace, "isInPlace");
  }, [isInPlace]);

  return (
    <>
      <motion.div
        className={className}
        initial={{ scale: initialScale }}
        onHoverStart={() => hasLanded && setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        whileHover={{ scale: 1, transition: { duration: 0.2 } }}
        style={{
          maxHeight: "90%",
          zIndex: 2,
          display: "flex",
          pointerEvents: hasLanded ? "all" : "none",
          // width: "100%", height: "auto"
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
