import { motion } from "framer-motion";
import Media from "@/components/Media/Media";

import { useEffect, useState } from "react";

const ExpandMedia = ({ medium, copyright, activeElement, isActive, hasLanded, objectFit }) => {
  const [isHovering, setIsHovering] = useState(false);
  const maxHeight = 600;
  const initialScale = (maxHeight - 80) / maxHeight; // 0.867
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    setShouldScroll(isActive !== undefined ? isActive : hasLanded && isHovering);
  }, [hasLanded, isActive]);

  return (
    <>
      <motion.div
        initial={{ scale: initialScale }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        whileHover={{ scale: 1, transition: { duration: 0.2 } }}
        style={{ maxHeight: "90%", zIndex: 2, display: "flex" }}
      >
        <Media
          medium={medium}
          copyright={copyright}
          activeElement={activeElement}
          isActive={shouldScroll}
          objectFit={objectFit}
        />
      </motion.div>
    </>
  );
};

export default ExpandMedia;
