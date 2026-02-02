import NextImage from "next/image";
import Copyright from "./Copyright";
import CropButton from "./CropButton";
import styles from "./Media.module.css";
import { useEffect, useState, useRef, forwardRef, useContext } from "react";

import { motion } from "framer-motion";
import { useMediaDimensions } from "./hooks/useMediaDimensions";
import { useImageSource } from "./hooks/useImageSource";
import PosterImage from "./Video/PosterImage";
import ZoomMediaWrapper from "../Animation/ZoomMediaWrapper";

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
    forwardedRef,
  ) => {
    const internalRef = useRef(null); // fallback ref
    const imageRef = forwardedRef || internalRef;

    const imageSource = useImageSource(medium, dimensions);

    const width = dimensions?.width || medium.width;
    const height = dimensions?.height || medium.height;

    const [isLoaded, setIsLoaded] = useState(false);

    const [cropped, setCropped] = useState(false);

    const usePlaceholder = width > 40;

    const { mediaWidth, mediaHeight } = useMediaDimensions(imageRef, [isLoaded, activeElement, isActive]);

    useEffect(() => {
      if (onWidth) onWidth(mediaWidth);
    }, [mediaWidth, mediaHeight]);

    const imageProps = {
      medium,
      imageSource,
      width,
      height,
      activeElement,
      isActive,
      objectFit,
      isActive,
      zoomOnHover,
      imageRef,
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
  },
);

const RawImage = forwardRef(
  (
    {
      imageSource,
      width,
      height,
      objectFit,
      usePlaceholder,
      setIsLoaded,
      className,
      cropped,
      showCrop,
      loadEager,
      setCropped,
      hideCropButton,
    },
    imageRef,
  ) => {
    const fit = showCrop ? (cropped === true ? "contain" : "cover") : objectFit || "cover";

    return (
      <div
        className={className}
        ref={imageRef}
        style={{
          width: "100%",
          height: "100%",
          aspectRatio: width / height,
          position: "relative",
        }}
      >
        {showCrop && !hideCropButton && <CropButton setCropped={setCropped} cropped={cropped} />}
        <NextImage
          src={imageSource}
          alt="image"
          unoptimized
          width={width}
          loading={loadEager ? "eager" : "lazy"}
          decoding="sync"
          height={height}
          draggable={false}
          placeholder={usePlaceholder ? "blur" : "empty"}
          blurDataURL={usePlaceholder ? imageSource + "?blur" : null}
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
  },
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
        <PosterImage medium={medium} />
        <ZoomMediaWrapper zoomOnHover={zoomOnHover}>
          <RawImage {...props} cropped={cropped} setCropped={setCropped} showCrop={showCrop} hideCropButton={true} />
        </ZoomMediaWrapper>
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
