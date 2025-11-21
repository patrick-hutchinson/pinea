"use client";

import Slideshow from "@/components/Slideshow/Slideshow";
import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";

import styles from "./HalfFigure.module.css";
import Media from "@/components/Media/Media";

const HalfFigure = ({ storyType, title, text, media, medium, className, onClick, style, mediaPairImage }) => {
  return (
    <div className={`${className} ${styles.container}`} onClick={onClick} style={style}>
      <Text className={styles.title} text={title} />

      {media && <Slideshow media={media} mediaPairImage={mediaPairImage} />}
      {medium && <Media medium={medium} mediaPairImage={mediaPairImage} />}
      <Text className={styles.description} text={text} />
      {/* <p className={styles.type} typo="h4">
        {storyType}
      </p> */}
    </div>
  );
};

export default HalfFigure;
