import NextImage from "next/image";
import Copyright from "./Copyright";

import styles from "./Media.module.css";
import { useEffect, useState, useRef } from "react";

const Image = ({ medium, dimensions, objectFit, copyright, className }) => {
  const hasCustomDimensions = dimensions;
  const resizedSrc = `${medium.url}?w=${dimensions?.width}&h=${dimensions?.height}&fit=crop&auto=format`;
  const src = hasCustomDimensions ? resizedSrc : medium.url;

  const width = dimensions?.width || medium.width;
  const height = dimensions?.height || medium.height;

  const [isLoaded, setIsLoaded] = useState(false);
  const [mediaWidth, setMediaWidth] = useState(null);
  const mediaRef = useRef(null);

  const usePlaceholder = width > 40;

  useEffect(() => {
    const imageWidth = mediaRef.current.getBoundingClientRect().width;
    if (!imageWidth) return;
    setMediaWidth(imageWidth);
  }, [isLoaded]);

  const imageProps = {
    medium,
    src,
    width,
    height,
    objectFit,
    mediaRef,
    className,
    usePlaceholder,
    setIsLoaded,
  };

  return copyright ? (
    <CopyrightedImage {...imageProps} copyright={copyright} mediaWidth={mediaWidth} />
  ) : (
    <RawImage {...imageProps} />
  );
};

const RawImage = ({ src, width, height, objectFit, mediaRef, usePlaceholder, setIsLoaded, className }) => (
  <div
    className={`${styles.media_wrapper} ${className}`}
    ref={mediaRef}
    style={{
      width: "100%",
      height: "100%",
      aspectRatio: width / height,
      overflow: "hidden",
      position: "relative",
    }}
  >
    <NextImage
      src={src}
      alt="image"
      unoptimized
      width={width}
      height={height}
      draggable={false}
      placeholder={usePlaceholder ? "blur" : "empty"}
      blurDataURL={usePlaceholder ? src + "?blur" : null} // or medium.lqip
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        objectFit: objectFit || "cover",
      }}
      onLoad={() => setIsLoaded(true)}
    />
  </div>
);

const CopyrightedImage = ({ copyright, mediaWidth, ...props }) => (
  <div style={{ position: "relative" }} className={styles.media_container}>
    <RawImage {...props} />
    <Copyright copyright={copyright} mediaWidth={mediaWidth} />
  </div>
);

export default Image;
