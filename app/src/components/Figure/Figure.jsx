"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Media from "@/components/Media/Media";
import Text from "@/components/Text/Text";
import Label from "@/components/Label/Label";
import Slideshow from "@/components/Slideshow/Slideshow";

import { translate } from "@/helpers/translate";

import styles from "./Figure.module.css";

export const ShowcaseFigure = ({ children, className, onClick, style }) => {
  return (
    <figure onClick={onClick} className={`${styles.figure} ${className} ${styles.showcase}`} style={style}>
      {children}
    </figure>
  );
};

export const FigCaption = ({ children, className }) => {
  return <figcaption className={`${styles.figcaption} ${className}`}>{children}</figcaption>;
};

export const MediaContainer = ({ children }) => {
  return <div className={styles.media_container}>{children}</div>;
};

export const Figure = ({
  storyType,
  title,
  text,
  media,
  medium,
  className,
  mediaPairImage,
  size,
  path,
  showCrop,
  showControls,
}) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(null);

  return (
    <div
      className={`${className} ${styles.container} ${size && styles[size]}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => path && router.push(path)}
    >
      <h3 className={styles.title} style={{ width: "80%" }}>
        <Text text={translate(title)} />
      </h3>
      <Text text={text} />
      {media && <Slideshow media={media} mediaPairImage={mediaPairImage} showCrop={showCrop} />}
      {medium && (
        <Media showControls={showControls} medium={medium} mediaPairImage={mediaPairImage} zoomOnHover={true} />
      )}

      {storyType && <Label className={styles.label}>{storyType}</Label>}
    </div>
  );
};
