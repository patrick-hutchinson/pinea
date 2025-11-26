import { motion } from "framer-motion";
import Media from "@/components/Media/Media";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalVariablesContext } from "@/context/GlobalVariablesContext";
import TextMarquee from "@/components/TextMarquee/TextMarquee";
import { useInView } from "framer-motion";
import styles from "./ShrinkMedia.module.css";
import { StateContext } from "@/context/StateContext";

const SatelliteShrink = ({ caption, medium, hasLanded, isActive, className, path }) => {
  const { isMobile } = useContext(StateContext);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mediaWidth, setMediaWidth] = useState(null);
  const mediaRef = useRef(null);
  const { line_height_4, caption_gap } = useContext(GlobalVariablesContext);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    // 1️⃣ If isActive is defined, use that.
    // 2️⃣ If on Desktop, use hasLanded and isHovering.
    // 3️⃣ If on Mobile, only use hasLanded.
    setShouldScroll(isActive !== undefined ? isActive : !isMobile ? hasLanded && isHovering : hasLanded);
  }, [hasLanded, isActive]);

  useEffect(() => {
    const active = hasLanded !== undefined ? hasLanded : isActive;
    if (!mediaRef.current) return;

    const mediaHeight = mediaRef.current.getBoundingClientRect().height;

    if (active) {
      const subtraction = (line_height_4 * 10 + caption_gap) * 2;
      setScale((mediaHeight - subtraction) / mediaHeight);
    } else {
      setScale(1); // reset scale when not active
    }
  }, [hasLanded, isActive]);

  // Define variants
  const mediaVariants = {
    rest: { scale: 1, transition: { duration: 0.2 } },
    hover: { scale: scale, transition: { duration: 0.2 } },
  };

  const captionVariants = {
    rest: { opacity: 0, transition: { duration: 0.3 } },
    hover: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.a
      href={path}
      initial="rest"
      whileHover={!isMobile ? "hover" : undefined}
      onHoverStart={!isMobile ? () => setIsHovering(true) : undefined}
      onHoverEnd={!isMobile ? () => setIsHovering(false) : undefined}
      animate="rest"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxHeight: "100%",
        height: "auto",
        width: "100%",
      }}
    >
      {/* Child that scales */}
      <motion.div
        variants={mediaVariants}
        animate={isMobile ? (shouldScroll ? "hover" : "rest") : undefined}
        style={{
          maxHeight: "100%",
          zIndex: 2,
          display: "flex",
          height: "auto",
          width: "100%",
        }}
      >
        <Media
          ref={mediaRef}
          medium={medium}
          objectFit="contain"
          // onWidth={(w) => setMediaWidth(w)}
        />
      </motion.div>

      <motion.div
        typo="h4"
        variants={captionVariants}
        animate={isMobile ? (shouldScroll ? "hover" : "rest") : undefined}
        style={{
          position: "relative",
          bottom: "20px",
          textAlign: "center",
          width: "100%",
          zIndex: 1,
        }}
      >
        {/* <p>{caption}</p> */}
        <div className={styles.caption} typo="h4">
          <div className={styles.caption_text} style={{ width: "100%" }}>
            <TextMarquee
              text={caption}
              mediaWidth={mediaWidth}
              activeElement={true}
              fontSize={13}
              isActive={shouldScroll}
              className={className}
            />
          </div>
        </div>
      </motion.div>
    </motion.a>
  );
};

export default SatelliteShrink;
