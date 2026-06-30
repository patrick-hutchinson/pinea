import { useEffect, useState, useRef, forwardRef, useContext } from "react";

import { useMediaDimensions } from "../../hooks/useMediaDimensions";

import PosterImage from "../PosterImage";
import ZoomMediaWrapper from "../../../Animation/ZoomMediaWrapper";
import Image from "./Image";
import Copyright from "../Copyright/Copyright";
import CropButton from "../CropButton";

import styles from "../../Media.module.css";
import Placeholder from "../Placeholder";
import { StateContext } from "@/context/StateContext";

const ImageFrame = forwardRef(
  (
    {
      medium,
      dimensions,
      objectFit,
      copyright,
      activeElement,
      onWidth,
      zoomOnHover,
      skipPlaceholder = "false",
      isActive,
      showCrop,
      defaultUncropped = false,
      loadEager,
      disableTapCopyright,
      forceCopyrightVisible = false,
      copyrightClassName,
      copyrightStyle,
    },
    forwardedRef,
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isTapped, setIsTapped] = useState(false);
    const { isMobile } = useContext(StateContext);
    const internalRef = useRef(null); // fallback ref
    const imageRef = forwardedRef || internalRef;
    const containerRef = useRef(null);

    const [isLoaded, setIsLoaded] = useState(false);
    const [cropped, setCropped] = useState(defaultUncropped);

    const { mediaWidth, mediaHeight } = useMediaDimensions(imageRef, [isLoaded, activeElement, isActive]);
    const { mediaWidth: containerWidth, mediaHeight: containerHeight } = useMediaDimensions(containerRef, [
      isLoaded,
      activeElement,
      isActive,
      cropped,
    ]);

    useEffect(() => {
      if (onWidth) onWidth(mediaWidth);
    }, [mediaWidth, mediaHeight]);

    const customObjectFit = objectFit ?? "cover";
    const mediaAspectRatio = (medium?.width || 1) / (medium?.height || 1);

    const getFitFrameSize = (mode) => {
      if (!containerWidth || !containerHeight) return null;
      const containerAspectRatio = containerWidth / containerHeight;
      const shouldUseWidth = mode === "contain" ? mediaAspectRatio > containerAspectRatio : mediaAspectRatio < containerAspectRatio;

      if (shouldUseWidth) {
        const width = containerWidth;
        const height = width / mediaAspectRatio;
        return { width, height };
      }

      const height = containerHeight;
      const width = height * mediaAspectRatio;
      return { width, height };
    };

    const fitFrameSize = showCrop ? getFitFrameSize(cropped ? "contain" : "cover") : null;
    const fitFrameStyle =
      showCrop && fitFrameSize
        ? {
            width: `${fitFrameSize.width}px`,
            height: `${fitFrameSize.height}px`,
          }
        : {};

    const resolvedObjectFit = showCrop ? "cover" : customObjectFit;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    useEffect(() => {
      if (!isMobile) setIsTapped(false);
    }, [isMobile]);

    return (
      <div
        className={styles.mediaContainer}
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
        onClick={() => {
          if (!isMobile || disableTapCopyright) return;
          setIsTapped((prev) => !prev);
        }}
      >
        <div className={styles.mediaContainer_inner} ref={containerRef}>
          {showCrop && <PosterImage medium={medium} loadEager={loadEager} />}
          <ZoomMediaWrapper zoomOnHover={zoomOnHover}>
            {!skipPlaceholder && <Placeholder medium={medium} loadEager={loadEager} isLoaded={isLoaded} />}
            {showCrop ? (
              <div className={styles.fitFrame} style={fitFrameStyle}>
                <Image
                  medium={medium}
                  dimensions={dimensions}
                  resolvedObjectFit={resolvedObjectFit}
                  preferFullImage={true}
                  imageRef={imageRef}
                  loadEager={loadEager}
                  setIsLoaded={setIsLoaded}
                  isLoaded={isLoaded}
                />
              </div>
            ) : (
              <Image
                medium={medium}
                dimensions={dimensions}
                resolvedObjectFit={resolvedObjectFit}
                imageRef={imageRef}
                loadEager={loadEager}
                setIsLoaded={setIsLoaded}
                isLoaded={isLoaded}
              />
            )}
          </ZoomMediaWrapper>
        </div>

        {showCrop && <CropButton setCropped={setCropped} cropped={cropped} resolvedObjectFit={resolvedObjectFit} />}

        {copyright && (
          <Copyright
            copyright={copyright}
            mediaWidth={mediaWidth}
            activeElement={activeElement}
            isActive={isActive}
            isHovered={isHovered}
            isTapped={isTapped}
            forceVisible={forceCopyrightVisible}
            className={copyrightClassName}
            style={copyrightStyle}
          />
        )}
      </div>
    );
  },
);

export default ImageFrame;
