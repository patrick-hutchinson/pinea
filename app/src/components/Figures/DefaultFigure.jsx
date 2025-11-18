"use client";

import Slideshow from "@/components/Slideshow/Slideshow";
import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";

import Media from "@/components/Media/Media";
import styles from "./DefaultFigure.module.css";

const DefaultFigure = ({ storyType, title, text, media, medium, className }) => {
  return (
    <div className={`${className} ${styles.container}`}>
      <h3>{translate(title)}</h3>
      <Text text={text} />
      {media && <Slideshow media={media} />}
      {medium && <Media medium={medium} />}
      <p className={styles.type} typo="h4">
        {storyType}
      </p>
    </div>
  );
};

export default DefaultFigure;
