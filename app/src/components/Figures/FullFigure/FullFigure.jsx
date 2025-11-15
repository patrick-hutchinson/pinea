"use client";

import Slideshow from "@/components/Slideshow/Slideshow";
import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";

import styles from "./FullFigure.module.css";
import Media from "@/components/Media/Media";

const FullFigure = ({ title, text, media, medium, className }) => {
  return (
    <div className={`${className} ${styles.container}`}>
      <h3>{translate(title)}</h3>
      <Text text={text} />
      {media && <Slideshow media={media} />}
      {medium && <Media medium={medium} />}
    </div>
  );
};

export default FullFigure;
