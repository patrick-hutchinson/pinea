import NextImage from "next/image";
import Copyright from "./Copyright";

import styles from "./Media.module.css";
import { useEffect, useState, useRef, forwardRef } from "react";

import { motion } from "framer-motion";

const Image = forwardRef(
  (
    { medium, dimensions, objectFit, copyright, className, activeElement, mediaPairImage, onWidth, isActive, showCrop },
    forwardedRef
  ) => {
    const internalRef = useRef(null); // fallback ref
    const ref = forwardedRef || internalRef;
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

      // setTimeout(() => {
      const imageWidth = ref.current.getBoundingClientRect().width;
      const imageHeight = ref.current.getBoundingClientRect().height;
      if (!imageWidth || !imageHeight) return;

      setMediaWidth(imageWidth);
      setMediaHeight(imageHeight);
      // }, 200);
    }, [isLoaded, activeElement, onWidth, isActive]);

    useEffect(() => {
      if (onWidth) onWidth(mediaWidth);
    }, [mediaWidth, mediaHeight]);

    const imageProps = {
      medium,
      src,
      width,
      height,
      activeElement,
      isActive,
      objectFit,
      ref,
      className,
      usePlaceholder,
      setIsLoaded,
    };

    return copyright && !mediaPairImage ? (
      <CopyrightedImage {...imageProps} copyright={copyright} mediaWidth={mediaWidth} />
    ) : mediaPairImage ? (
      <MediaPairImage {...imageProps} copyright={copyright} mediaWidth={mediaWidth} showCrop={showCrop} />
    ) : (
      <RawImage {...imageProps} />
    );
  }
);

const RawImage = forwardRef(
  ({ src, width, height, objectFit, usePlaceholder, setIsLoaded, className, cropped, isActive }, ref) => {
    const fit =
      cropped !== undefined
        ? cropped
          ? "contain" // cropped true
          : "cover" // cropped false
        : objectFit || "cover"; // cropped undefined → objectFit or fallback

    return (
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
            objectFit: fit,
          }}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    );
  }
);

RawImage.displayName = "RawImage";

const CopyrightedImage = ({ copyright, mediaWidth, activeElement, isActive, ...props }) => (
  <div style={{ position: "relative", width: "100%", height: "100%" }} className={styles.media_container}>
    <RawImage {...props} />
    <Copyright copyright={copyright} mediaWidth={mediaWidth} isActive={isActive} />
  </div>
);

export const MediaPairImage = ({ copyright, mediaWidth, activeElement, showCrop, ...props }) => {
  const [cropped, setCropped] = useState(false);
  console.log(showCrop);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }} className={styles.media_container}>
      {showCrop && (
        <div
          onClick={(e) => {
            e.stopPropagation(); // 👈 prevent parent clicks
            setCropped((prev) => !prev);
          }}
          style={{
            position: "absolute",
            bottom: "6px",
            right: "16px",
            height: "20px",
            zIndex: 1,
            fontSize: "var(--font-size-5)",
          }}
        >
          {cropped ? "ZOOM IN" : "ZOOM OUT"}
        </div>
      )}
      <div style={{ overflow: "hidden" }}>
        <motion.div
          onMouseEnter={() => console.log("hovered in")}
          whileHover={{ scale: 1.1 }}
          transition={{ stiffness: 200, damping: 20 }}
          style={{ originX: 0.5, originY: 0.5 }} // optional, centers the scaling
        >
          <RawImage {...props} cropped={cropped} />
        </motion.div>
      </div>

      <Copyright
        copyright={copyright}
        mediaWidth={mediaWidth}
        activeElement={activeElement}
        className={styles.slideshow_copyright}
      />
    </div>
  );
};

export default Image;
