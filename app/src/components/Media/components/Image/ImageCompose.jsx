import { useEffect, useState, useRef, forwardRef } from "react";

import { useMediaDimensions } from "../../hooks/useMediaDimensions";

import PosterImage from "../PosterImage";
import ZoomMediaWrapper from "../../../Animation/ZoomMediaWrapper";
import Image from "./Image";
import Copyright from "../Copyright/Copyright";
import CropButton from "../CropButton";

import styles from "../../Media.module.css";
import Placeholder from "../Placeholder";

const ImageFrame = forwardRef(
  (
    { medium, dimensions, objectFit, copyright, activeElement, onWidth, zoomOnHover, isActive, showCrop, loadEager },
    forwardedRef,
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const internalRef = useRef(null); // fallback ref
    const imageRef = forwardedRef || internalRef;

    const [isLoaded, setIsLoaded] = useState(false);
    const [cropped, setCropped] = useState(false);

    const { mediaWidth, mediaHeight } = useMediaDimensions(imageRef, [isLoaded, activeElement, isActive]);

    useEffect(() => {
      if (onWidth) onWidth(mediaWidth);
    }, [mediaWidth, mediaHeight]);

    const resolvedObjectFit = showCrop ? (cropped ? "contain" : "cover") : (objectFit ?? "cover");

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    return (
      <div className={styles.mediaContainer} onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()}>
        <div className={styles.mediaContainer_inner}>
          {showCrop && <PosterImage medium={medium} loadEager={loadEager} />}
          <ZoomMediaWrapper zoomOnHover={zoomOnHover}>
            <Placeholder medium={medium} loadEager={loadEager} isLoaded={isLoaded} />
            <Image
              medium={medium}
              dimensions={dimensions}
              resolvedObjectFit={resolvedObjectFit}
              imageRef={imageRef}
              loadEager={loadEager}
              setIsLoaded={setIsLoaded}
            />
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
          />
        )}
      </div>
    );
  },
);

export default ImageFrame;
