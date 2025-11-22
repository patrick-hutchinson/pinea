import NextImage from "next/image";
import Copyright from "./Copyright";
import CropButton from "./CropButton";
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

    const [cropped, setCropped] = useState(false);

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
      <CopyrightedImage
        {...imageProps}
        copyright={copyright}
        mediaWidth={mediaWidth}
        cropped={cropped}
        setCropped={setCropped}
      />
    ) : mediaPairImage ? (
      <MediaPairImage
        {...imageProps}
        copyright={copyright}
        mediaWidth={mediaWidth}
        showCrop={showCrop}
        cropped={cropped}
        setCropped={setCropped}
      />
    ) : (
      <RawImage {...imageProps} showCrop={showCrop} cropped={cropped} setCropped={setCropped} />
    );
  }
);

const RawImage = forwardRef(
  (
    { src, width, height, objectFit, usePlaceholder, setIsLoaded, className, cropped, isActive, showCrop, setCropped },
    ref
  ) => {
    const fit =
      cropped !== undefined
        ? cropped
          ? "contain" // cropped true
          : "cover" // cropped false
        : objectFit || "cover"; // cropped undefined → objectFit or fallback

    return (
      <div
        className={className}
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
          aspectRatio: width / height,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {showCrop && <CropButton setCropped={setCropped} cropped={cropped} />}
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

export const MediaPairImage = ({ copyright, mediaWidth, activeElement, showCrop, cropped, setCropped, ...props }) => {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }} className={styles.media_container}>
      {showCrop && <CropButton setCropped={setCropped} cropped={cropped} />}
      <div style={{ overflow: "hidden" }}>
        <motion.div
          onMouseEnter={() => console.log("hovered in")}
          whileHover={{ scale: 1.1 }}
          transition={{ stiffness: 200, damping: 20 }}
          style={{ originX: 0.5, originY: 0.5 }} // optional, centers the scaling
        >
          <RawImage {...props} cropped={cropped} setCropped={setCropped} />
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
