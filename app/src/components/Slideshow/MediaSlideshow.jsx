"use client";

import Media from "@/components/Media/Media";
import styles from "./Slideshow.module.css";
import FadePresence from "../Animation/FadePresence";

import { useSlider } from "./helpers/useSlider";
import CopyrightHover from "@/components/CopyrightHover/CopyrightHover";

import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";

const MediaSlideshow = ({ media, useCopyrightOverlay, showCrop, isActive, zoomOnHover }) => {
  const { current, handleMouseEnter, handleMouseLeave, handleClick, onTouchMove, onTouchStart, onTouchEnd, setCurrent } =
    useSlider({
      array: media,
      length: media.length,
      auto: true, // 👈 important
    });

  return (
    <FadePresence
      className={styles.container}
      motionKey={media[current].url}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Media
        medium={media[current].medium}
        copyright={<Text text={translate(media[current].medium.copyrightInternational)} typo="h5" />}
        showCrop={showCrop}
        isActive={isActive}
        showControls={true}
        zoomOnHover={zoomOnHover}
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

export default MediaSlideshow;
