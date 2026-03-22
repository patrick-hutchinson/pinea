import { motion, useInView } from "framer-motion";
import Media from "@/components/Media/Media";
import { useContext, useEffect, useRef, useState } from "react";
import { CSSContext } from "@/context/CSSContext";
import { StateContext } from "@/context/StateContext";
import TextMarquee from "@/components/TextMarquee/TextMarquee";

import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "./ShrinkMedia.module.css";

const ShrinkMedia = ({ caption, medium, isActive, className, path, containerDimensions, externalHoverActive }) => {
  const { isMobile } = useContext(StateContext);
  const [mediaWidth, setMediaWidth] = useState(null);
  const mediaRef = useRef(null);
  const containerRef = useRef(null);
  const { line_height_4, caption_gap } = useContext(CSSContext);

  const [scale, setScale] = useState(1);

  const isInView = useInView(containerRef, {
    margin: "-30% 0px -40% 0px",
  });

  useEffect(() => {
    if (!mediaRef.current) return;

    const mediaHeight = mediaRef.current.getBoundingClientRect().height;

    if (isActive) {
      const subtraction = (line_height_4 * 10 + caption_gap) * 2;
      setScale((mediaHeight - subtraction) / mediaHeight);
    } else {
      setScale(1);
    }
  }, [isActive, line_height_4, caption_gap]);

  const mediaVariants = {
    rest: { scale: 1, transition: { duration: 0.3 } },
    hover: { scale, transition: { duration: 0.3 } },
  };

  const captionVariants = {
    rest: { opacity: 0, transition: { duration: 0.3 } },
    hover: { opacity: 1, transition: { duration: 0.3 } },
  };

  const Wrapper = path ? AnimationLink : "div";
  const wrapperProps = path ? { path } : {};

  const aspectRatio = medium.width / medium.height;

  const maxImageWidth = containerDimensions?.width * 0.8;
  const maxImageHeight = containerDimensions?.height * 0.8;

  let imageWidth;
  let imageHeight;

  const wFromWidth = maxImageWidth;
  const hFromWidth = maxImageWidth / aspectRatio;

  const hFromHeight = maxImageHeight;
  const wFromHeight = maxImageHeight * aspectRatio;

  if (hFromWidth <= maxImageHeight) {
    imageWidth = `${wFromWidth}px`;
    imageHeight = `${hFromWidth}px`;
  } else {
    imageWidth = `${wFromHeight}px`;
    imageHeight = `${hFromHeight}px`;
  }

  const hasExternalHoverControl = typeof externalHoverActive === "boolean";
  const desktopState = hasExternalHoverControl ? (externalHoverActive ? "hover" : "rest") : "rest";

  return (
    <Wrapper {...wrapperProps}>
      <div ref={containerRef}>
        <motion.div
          initial="rest"
          whileHover={!isMobile && !hasExternalHoverControl ? "hover" : undefined}
          animate={desktopState}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
            maxHeight: maxImageHeight,
            maxWidth: maxImageWidth,
            width: imageWidth,
            height: imageHeight,
          }}
        >
          <motion.div
            variants={mediaVariants}
            animate={isMobile ? (isInView ? "hover" : "rest") : undefined}
            style={{
              zIndex: 2,
              display: "flex",
              height: "100%",
              width: "100%",
              willChange: "transform",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
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
