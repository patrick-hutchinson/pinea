"use client";

import { useEffect, useRef, useState } from "react";
import Media from "@/components/Media/Media";
import styles from "./Slideshow.module.css";
import FadePresence from "../Animation/FadePresence";

import { useSlider } from "./helpers/useSlider";
import CopyrightHover from "@/components/CopyrightHover/CopyrightHover";

import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";
import { motion, AnimatePresence } from "framer-motion";

const MediaSlideshow = ({ media, useCopyrightOverlay, showCrop, isActive, zoomOnHover, autoHideTapCopyrightDuration }) => {
  const safeMedia = Array.isArray(media) ? media.filter((item) => item?.medium) : [];
  const [forceCopyrightVisible, setForceCopyrightVisible] = useState(false);
  const copyrightTimeoutRef = useRef(null);

  const { current, handleMouseEnter, handleMouseLeave, handleClick, onTouchMove, onTouchStart, onTouchEnd, setCurrent } =
    useSlider({
      array: safeMedia,
      length: Math.max(safeMedia.length, 1),
      auto: true, // 👈 important
    });
  if (safeMedia.length === 0) return null;

  const showTimedCopyright = () => {
    if (!autoHideTapCopyrightDuration) return;

    window.clearTimeout(copyrightTimeoutRef.current);
    setForceCopyrightVisible(true);
    copyrightTimeoutRef.current = window.setTimeout(() => {
      setForceCopyrightVisible(false);
    }, autoHideTapCopyrightDuration);
  };

  useEffect(
    () => () => {
      window.clearTimeout(copyrightTimeoutRef.current);
    },
    [],
  );

  const currentMedium = safeMedia[current]?.medium;
  if (!currentMedium) return null;

  return (
    <div
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        showTimedCopyright();
        handleClick();
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          style={{ width: "100%", height: "100%", position: "relative" }}
        >
          <Media
            medium={currentMedium}
            copyright={<Text text={translate(currentMedium?.copyrightInternational)} typo="h5" />}
            showCrop={showCrop}
            isActive={isActive}
            showControls={true}
            zoomOnHover={zoomOnHover}
            autoHideTapCopyrightDuration={autoHideTapCopyrightDuration}
            forceCopyrightVisible={forceCopyrightVisible}
          />

          {useCopyrightOverlay && (
            <CopyrightHover
              copyright={translate(currentMedium?.copyrightInternational)}
              className={styles.slideshow_copyright}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <ul className={styles.marker_wrapper}>
        {safeMedia.map((_, index) => (
          <li
            key={index}
            className={`${styles.marker} ${index === current ? styles.current : ""}`}
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering next() when clicking marker
              showTimedCopyright();
              setCurrent(index);
            }}
          />
        ))}
      </ul>
    </div>
  );
};

export default MediaSlideshow;
