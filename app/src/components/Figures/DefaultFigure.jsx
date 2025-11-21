"use client";

import Slideshow from "@/components/Slideshow/Slideshow";
import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";
import { motion } from "framer-motion";

import Media from "@/components/Media/Media";
import styles from "./DefaultFigure.module.css";
import Label from "@/components/Label/Label";
import { useState } from "react";

const DefaultFigure = ({ storyType, title, text, media, medium, className, mediaPairImage }) => {
  const [isHovered, setIsHovered] = useState(null);

  return (
    <div
      className={`${className} ${styles.container}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className={styles.title} style={{ width: "80%" }}>
        <Text text={translate(title)} />
      </h3>
      <Text text={text} />
      {media && <Slideshow media={media} mediaPairImage={mediaPairImage} />}
      {medium && <Media medium={medium} mediaPairImage={mediaPairImage} />}
      {/* <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`${styles.type} ${media && styles.isSlideshow}`}
        typo="h4"
      >
        {storyType}
      </motion.p> */}
      {storyType && <Label className={styles.label}>{storyType}</Label>}
    </div>
  );
};

export default DefaultFigure;
