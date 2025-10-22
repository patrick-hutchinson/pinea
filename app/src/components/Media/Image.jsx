import NextImage from "next/image";
import Copyright from "./Copyright";

import styles from "./Media.module.css";
import { useEffect, useState, useRef } from "react";

const Image = ({ medium, dimensions, objectFit, copyright }) => {
  const hasCustomDimensions = dimensions;
  const resizedSrc = `${medium.url}?w=${dimensions?.width}&h=${dimensions?.height}&fit=crop&auto=format`;
  const src = hasCustomDimensions ? resizedSrc : medium.url;

  const width = dimensions?.width || medium.width;
  const height = dimensions?.height || medium.height;

  const [isLoaded, setIsLoaded] = useState(false);

  const usePlaceholder = width > 40 || width > 40;

  const [mediaWidth, setMediaWidth] = useState(null);
  const mediaRef = useRef(null);

  useEffect(() => {
    const imageWidth = mediaRef.current.getBoundingClientRect().width;
    if (!imageWidth || imageWidth == 0) return undefined;
    // console.log(mediaRef.current.getBoundingClientRect().width, "media width");
    setMediaWidth(mediaRef.current.getBoundingClientRect().width);
  }, [isLoaded]);

  return (
    <div style={{ position: "relative" }} className={styles.media_container}>
      <div
        className={styles.media_wrapper}
        ref={mediaRef}
        style={{
          width: "100%",
          height: "100%",
          aspectRatio: medium.width / medium.height,
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
          blurDataURL={usePlaceholder ? medium.lqip : null}
          style={{
            position: "relative",
            opacity: 1,
            zIndex: 0,
            width: "100%",
            height: "100%",
            objectFit: objectFit || "cover", // or cover?
          }}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      {copyright && <Copyright copyright={copyright} mediaWidth={mediaWidth} />}
    </div>
  );
};

export default Image;
