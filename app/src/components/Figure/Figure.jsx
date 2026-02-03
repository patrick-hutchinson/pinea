"use client";

import { useState, useContext } from "react";

import { translate } from "@/helpers/translate";
import { AnimatePresence, motion } from "framer-motion";

import { StateContext } from "@/context/StateContext";

import Media from "@/components/Media/Media";
import Text from "@/components/Text/Text";
import Label from "@/components/Label/Label";
import MediaSlideshow from "@/components/Slideshow/MediaSlideshow";
import AnimationLink from "@/components/Animation/AnimationLink";
import ShareButton from "../Buttons/ShareButton";

import styles from "./Figure.module.css";

export const Figure = ({
  storyType,
  title,
  text,
  media,
  medium,
  className,
  size,
  path,
  showCrop,
  showControls,
  isActive,
  showShare,
}) => {
  const { isMobile } = useContext(StateContext);
  const [isHovered, setIsHovered] = useState(false);

  const Wrapper = path ? AnimationLink : "div";
  const wrapperProps = path ? { path } : {};

  return (
    <Wrapper
      className={`${className} ${styles.figureContainer} ${size && styles[size]}`}
      {...wrapperProps}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className={styles.title} style={{ width: "90%" }}>
        <Text text={translate(title)} />
      </h3>
      <Text className={styles.teaser} text={text} />
      {media && <MediaSlideshow media={media} showCrop={showCrop} isActive={isActive} zoomOnHover={true} />}
      {medium && <Media showControls={showControls} medium={medium} zoomOnHover={true} isActive={isActive} />}

      {storyType && <Label className={styles.label}>{storyType}</Label>}

      <AnimatePresence>
        {showShare && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: isHovered || isMobile ? 1 : 0 }} exit={{ opacity: 0 }}>
            <ShareButton className={styles.shareButton} url={path} />
          </motion.span>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};
