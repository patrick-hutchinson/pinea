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

      const imageWidth = ref.current.getBoundingClientRect().width;
      const imageHeight = ref.current.getBoundingClientRect().height;
      if (!imageWidth || !imageHeight) return;

      setMediaWidth(imageWidth);
      setMediaHeight(imageHeight);
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
      isActive,
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
        showCrop={showCrop}
      />
    ) : mediaPairImage ? (
      <MediaPairImage
        {...imageProps}
        copyright={copyright}
        mediaWidth={mediaWidth}
        showCrop={showCrop}
        cropped={cropped}
        setCropped={setCropped}
        isActive={isActive}
        medium={medium}
      />
    ) : (
      <RawImage {...imageProps} showCrop={showCrop} cropped={cropped} setCropped={setCropped} />
    );
  }
);

const RawImage = forwardRef(
  (
    {
      src,
      width,
      height,
      objectFit,
      usePlaceholder,
      setIsLoaded,
      className,
      cropped,
      isActive,
      showCrop,
      setCropped,
      hideCropButton,
      medium,
    },
    ref
  ) => {
    const fit = showCrop ? (cropped === true ? "contain" : "cover") : objectFit || "cover";

    return (
      <div
        className={className}
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
          aspectRatio: width / height,
          // overflow: "hidden",
          position: "relative",
        }}
      >
        {showCrop && !hideCropButton && <CropButton setCropped={setCropped} cropped={cropped} />}
        <NextImage
          src={src}
          alt="image"
          unoptimized
          width={width}
          loading="eager"
          decoding="sync"
          height={height}
          draggable={false}
          placeholder={usePlaceholder ? "blur" : "empty"}
          blurDataURL={usePlaceholder ? src + "?blur" : null}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            objectFit: fit,
            willChange: "transform",
            objectPosition: "center",
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

export const MediaPairImage = ({
  copyright,
  mediaWidth,
  activeElement,
  showCrop,
  cropped,
  isActive,
  setCropped,
  medium,
  ...props
}) => {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }} className={styles.media_container}>
      {showCrop && <CropButton setCropped={setCropped} cropped={cropped} />}
      <div style={{ overflow: "hidden", position: "relative" }}>
        <img
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            filter: "blur(20px) brightness(1) ",
            transform: "scale(2)",
          }}
          src={`${medium.url}?w=20&fit=crop&auto=format`}
        />
        <motion.div
          onMouseEnter={() => console.log("hovered in")}
          whileHover={{ scale: 1.1 }}
          transition={{ stiffness: 200, damping: 20 }}
          style={{ originX: 0.5, originY: 0.5 }} // optional, centers the scaling
        >
          <RawImage {...props} cropped={cropped} setCropped={setCropped} showCrop={showCrop} hideCropButton={true} />
        </motion.div>
      </div>

      <Copyright
        copyright={copyright}
        mediaWidth={mediaWidth}
        activeElement={activeElement}
        isActive={isActive}
        className={styles.slideshow_copyright}
      />
    </div>
  );
};

export default Image;
