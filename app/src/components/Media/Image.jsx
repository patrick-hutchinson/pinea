import NextImage from "next/image";
import Copyright from "./Copyright";
import CropButton from "./CropButton";
import styles from "./Media.module.css";
import { useEffect, useState, useRef, forwardRef, useContext } from "react";
import { StateContext } from "@/context/StateContext";

import { motion } from "framer-motion";

const Image = forwardRef(
  (
    {
      medium,
      dimensions,
      objectFit,
      copyright,
      className,
      activeElement,
      mediaPairImage,
      onWidth,
      zoomOnHover,
      isActive,
      showCrop,
      loadEager,
    },
    forwardedRef
  ) => {
    const { isMobile } = useContext(StateContext);
    const internalRef = useRef(null); // fallback ref
    const ref = forwardedRef || internalRef;

    // 1. Custom dimensions always take priority
    const hasCustomDimensions = dimensions;

    let src;

    // --- 1. DESKTOP LOGIC (your existing rules) ----

    if (hasCustomDimensions) {
      // Custom dimensions always win
      src = `${medium.url}?w=${dimensions.width}&h=${dimensions.height}&fit=crop&auto=format`;
    } else if (medium.width && medium.height) {
      // Safe downscaling (only if metadata exists)
      const MAX_SIZE = 3000;
      const originalW = medium.width;
      const originalH = medium.height;

      const scale =
        originalW > MAX_SIZE || originalH > MAX_SIZE ? Math.min(MAX_SIZE / originalW, MAX_SIZE / originalH) : 1;

      const targetW = Math.round(originalW * scale);
      const targetH = Math.round(originalH * scale);

      src = `${medium.url}?w=${targetW}&h=${targetH}&fit=crop&auto=format`;
    } else {
      // Fallback (no metadata → use original URL)
      src = medium.url;
    }

    // --- 2. MOBILE OVERRIDE (only if no custom dimensions) ----

    if (isMobile && !hasCustomDimensions && medium.width && medium.height) {
      // Choose your mobile scaling factor
      const MOBILE_SCALE = 0.8; // e.g. 30% of resolution

      const mobileW = Math.round(medium.width * MOBILE_SCALE);
      const mobileH = Math.round(medium.height * MOBILE_SCALE);

      src = `${medium.url}?w=${mobileW}&h=${mobileH}&fit=crop&auto=format`;
    }

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
      zoomOnHover,
      ref,
      loadEager,
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
      loadEager,
      setCropped,
      hideCropButton,
      medium,
    },
    ref
  ) => {
    const fit = showCrop ? (cropped === true ? "contain" : "cover") : objectFit || "cover";

    const { isMobile } = useContext(StateContext);

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
          loading={loadEager ? "eager" : "lazy"}
          // sizes={isMobile ? "100vw" : "100vw"}
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
  zoomOnHover,
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
          whileHover={zoomOnHover && { scale: 1.05 }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 18,
            mass: 0.8, // lowers initial acceleration → gentler start
            velocity: 0.2, // small push to start slow then speed up
          }}
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
