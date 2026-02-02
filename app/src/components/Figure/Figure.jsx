"use client";

import { translate } from "@/helpers/translate";

import Media from "@/components/Media/Media";
import Text from "@/components/Text/Text";
import Label from "@/components/Label/Label";
import Slideshow from "@/components/Slideshow/Slideshow";
import AnimationLink from "@/components/Animation/AnimationLink";
import ShareButton from "../Buttons/ShareButton";

import styles from "./Figure.module.css";

export const Figure = ({
  storyType,
  title,
  text,
  media,
  medium,
  className,
  size,
  path,
  showCrop,
  showControls,
  isActive,
  showShare,
}) => {
  const Wrapper = path ? AnimationLink : "div";
  const wrapperProps = path ? { path } : {};

  return (
    <Wrapper className={`${className} ${styles.figureContainer} ${size && styles[size]}`} {...wrapperProps}>
      <h3 className={styles.title} style={{ width: "90%" }}>
        <Text text={translate(title)} />
      </h3>
      <Text className={styles.teaser} text={text} />
      {media && <Slideshow media={media} showCrop={showCrop} isActive={isActive} zoomOnHover={true} />}
      {medium && <Media showControls={showControls} medium={medium} zoomOnHover={true} isActive={isActive} />}

      {storyType && <Label className={styles.label}>{storyType}</Label>}
      {showShare && <ShareButton className={styles.shareButton} url={path} />}
    </Wrapper>
  );
};
