import NextImage from "next/image";
import Copyright from "./Copyright";

import styles from "./Media.module.css";
import { useEffect, useState, useRef, forwardRef } from "react";

const Image = forwardRef(({ medium, dimensions, objectFit, copyright, className, handleLoaded }, ref) => {
  const hasCustomDimensions = dimensions;
  const resizedSrc = `${medium.url}?w=${dimensions?.width}&h=${dimensions?.height}&fit=crop&auto=format`;
  const src = hasCustomDimensions ? resizedSrc : medium.url;

  const width = dimensions?.width || medium.width;
  const height = dimensions?.height || medium.height;

  const [isLoaded, setIsLoaded] = useState(false);
  const [mediaWidth, setMediaWidth] = useState(null);
  const [mediaHeight, setMediaHeight] = useState(null);
  // const ref = useRef(null);

  const usePlaceholder = width > 40;

  useEffect(() => {
    if (!ref?.current) return; // ✅ Prevents crash if ref not yet attached

    const imageWidth = ref.current.getBoundingClientRect().width;
    const imageHeight = ref.current.getBoundingClientRect().height;
    if (!imageWidth || !imageHeight) return;
    setMediaWidth(imageWidth);
    setMediaHeight(imageHeight);
  }, [isLoaded]);

  useEffect(() => {
    if (handleLoaded && mediaWidth) {
      handleLoaded(mediaWidth, mediaHeight);
    }
  }, [mediaWidth, mediaHeight, handleLoaded]);

  const imageProps = {
    handleLoaded,
    medium,
    src,
    width,
    height,
    objectFit,
    ref,
    className,
    usePlaceholder,
    setIsLoaded,
  };

  return copyright ? (
    <CopyrightedImage {...imageProps} copyright={copyright} mediaWidth={mediaWidth} />
  ) : (
    <RawImage {...imageProps} />
  );
});

const RawImage = forwardRef(({ src, width, height, objectFit, usePlaceholder, setIsLoaded, className }, ref) => (
  <div
    className={`${styles.media_wrapper} ${className}`}
    ref={ref}
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
      blurDataURL={usePlaceholder ? src + "?blur" : null}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        objectFit: objectFit || "cover",
      }}
      onLoad={() => setIsLoaded(true)}
    />
  </div>
));

RawImage.displayName = "RawImage";

const CopyrightedImage = ({ copyright, mediaWidth, ...props }) => (
  <div style={{ position: "relative" }} className={styles.media_container}>
    <RawImage {...props} />
    <Copyright copyright={copyright} mediaWidth={mediaWidth} />
  </div>
);

export default Image;
