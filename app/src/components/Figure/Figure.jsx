"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Media from "@/components/Media/Media";
import Text from "@/components/Text/Text";
import Label from "@/components/Label/Label";
import Slideshow from "@/components/Slideshow/Slideshow";

import { translate } from "@/helpers/translate";

import styles from "./Figure.module.css";
import Link from "next/link";

export const ShowcaseFigure = ({ children, className, onClick, style, path }) => {
  const Wrapper = path ? Link : "div";
  const wrapperProps = path ? { href: path } : {};

  return (
    <Wrapper {...wrapperProps}>
      <figure onClick={onClick} className={`${styles.figure} ${className} ${styles.showcase}`} style={style}>
        {children}
      </figure>
    </Wrapper>
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
  isActive,
}) => {
  const Wrapper = path ? Link : "div";
  const wrapperProps = path ? { href: path } : {};

  return (
    <Wrapper className={`${className} ${styles.container} ${size && styles[size]}`} {...wrapperProps}>
      <h3 className={styles.title} style={{ width: "80%" }}>
        <Text text={translate(title)} />
      </h3>
      <Text className={styles.teaser} text={text} />
      {media && <Slideshow media={media} mediaPairImage={mediaPairImage} showCrop={showCrop} isActive={isActive} />}
      {medium && (
        <Media
          showControls={showControls}
          medium={medium}
          mediaPairImage={mediaPairImage}
          zoomOnHover={true}
          isActive={isActive}
        />
      )}

      {storyType && <Label className={styles.label}>{storyType}</Label>}
    </Wrapper>
  );
};
