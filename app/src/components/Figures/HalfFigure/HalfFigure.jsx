"use client";

import Slideshow from "@/components/Slideshow/Slideshow";
import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";

import styles from "./HalfFigure.module.css";
import Media from "@/components/Media/Media";

const HalfFigure = ({ storyType, title, text, media, medium, className }) => {
  return (
    <div className={`${className} ${styles.container}`}>
      <h3>{translate(title)}</h3>
      {media && <Slideshow media={media} />}
      {medium && <Media medium={medium} />}
      <Text text={text} />
      <p className={styles.type} typo="h4">
        {storyType}
      </p>
    </div>
  );
};

export default HalfFigure;
