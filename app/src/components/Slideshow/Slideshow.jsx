"use client";

import { useState, useEffect, useRef } from "react";
import Media from "@/components/Media/Media";
import styles from "./Slideshow.module.css";
import FadePresence from "../Animation/FadePresence";
import CopyrightHover from "@/components/CopyrightHover/CopyrightHover";

import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";

const Slideshow = ({ media, mediaPairImage, useCopyrightOverlay, showCrop, isActive }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  const resolvedMediaPairImage =
    mediaPairImage !== undefined ? mediaPairImage : !!media[current].medium.copyrightInternational;

  const next = () => {
    setCurrent((prev) => (prev + 1) % media.length);
  };

  // auto advance
  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(next, 4000);
    }

    return () => clearInterval(intervalRef.current);
  }, [paused, media.length]);

  const handleMouseEnter = () => {
    setPaused(true);
    clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    setPaused(false);
  };

  const handleClick = () => {
    next();
  };

  return (
    <FadePresence
      className={styles.container}
      motionKey={media[current].url}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <Media
        medium={media[current].medium}
        copyright={<Text text={translate(media[current].medium.copyrightInternational)} />}
        // mediaPairImage={media[current].medium.copyrightInternational && true}
        mediaPairImage={resolvedMediaPairImage}
        showCrop={showCrop}
        isActive={isActive}
      />

      {useCopyrightOverlay && (
        <CopyrightHover
          copyright={translate(media[current].medium.copyrightInternational)}
          className={styles.slideshow_copyright}
        />
      )}

      <ul className={styles.marker_wrapper}>
        {media.map((_, index) => (
          <li
            key={index}
            className={`${styles.marker} ${index === current ? styles.current : ""}`}
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering next() when clicking marker
              setCurrent(index);
            }}
          />
        ))}
      </ul>
    </FadePresence>
  );
};

export default Slideshow;
