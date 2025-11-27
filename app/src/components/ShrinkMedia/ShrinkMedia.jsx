import { motion, useInView } from "framer-motion";
import Media from "@/components/Media/Media";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalVariablesContext } from "@/context/GlobalVariablesContext";
import TextMarquee from "@/components/TextMarquee/TextMarquee";
import Link from "next/link";

import styles from "./ShrinkMedia.module.css";
import { StateContext } from "@/context/StateContext";

const ShrinkMedia = ({ caption, medium, isActive, className, path }) => {
  const { isMobile } = useContext(StateContext);
  const [isHovering, setIsHovering] = useState(false);
  const [mediaWidth, setMediaWidth] = useState(null);
  const mediaRef = useRef(null);
  const containerRef = useRef(null);
  const { line_height_4, caption_gap } = useContext(GlobalVariablesContext);

  const [scale, setScale] = useState(1);

  const isInView = useInView(containerRef, {
    margin: "-30% 0px -40% 0px", // tweak depending on your header or padding
  });

  useEffect(() => {
    console.log("in view");
  }, [isInView]);

  useEffect(() => {
    if (!mediaRef.current) return;

    const mediaHeight = mediaRef.current.getBoundingClientRect().height;

    if (isActive) {
      const subtraction = (line_height_4 * 10 + caption_gap) * 2;
      setScale((mediaHeight - subtraction) / mediaHeight);
    } else {
      setScale(1); // reset scale when not active
    }
  }, [isActive]);

  // Define variants
  const mediaVariants = {
    rest: { scale: 1, transition: { duration: 0.2 } },
    hover: { scale: scale, transition: { duration: 0.2 } },
  };

  const captionVariants = {
    rest: { opacity: 0, transition: { duration: 0.3 } },
    hover: { opacity: 1, transition: { duration: 0.3 } },
  };

  const Wrapper = path ? Link : "div";
  const wrapperProps = path ? { href: path } : {};

  return (
    <Wrapper {...wrapperProps}>
      <div ref={containerRef}>
        <motion.div
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
            height: "100%",
            width: "100%",
          }}
        >
          {/* Child that scales */}
          <motion.div
            variants={mediaVariants}
            animate={isMobile ? (isInView ? "hover" : "rest") : undefined}
            style={{
              maxHeight: "100%",
              zIndex: 2,
              display: "flex",
              height: "auto",
              width: "100%",
            }}
          >
            <Media ref={mediaRef} medium={medium} objectFit="contain" onWidth={(w) => setMediaWidth(w)} />
          </motion.div>

          <motion.div
            typo="h4"
            variants={captionVariants}
            animate={isMobile ? (isInView ? "hover" : "rest") : undefined}
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
                  isActive={isActive}
                  className={className}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Wrapper>
  );
};

export default ShrinkMedia;
