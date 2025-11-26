import { motion } from "framer-motion";
import Media from "@/components/Media/Media";

import { useEffect, useState, useContext } from "react";

import { StateContext } from "@/context/StateContext";

const CalendarExpandMedia = ({ medium, copyright, activeElement, isActive, hasLanded, objectFit, className }) => {
  const { isSafari } = useContext(StateContext);
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

export default CalendarExpandMedia;
