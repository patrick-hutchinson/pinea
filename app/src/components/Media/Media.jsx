"use client";

import { forwardRef } from "react";

import React from "react";
import Image from "./Image";
import Video from "./Video";

const Media = forwardRef(
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
      isActive,
      showControls,
      zoomOnHover,
      showCrop,
    },
    ref
  ) => {
    if (!medium || (!medium.url && !medium.playbackId)) return undefined;

    if (showControls) {
      console.log(showControls, "show controls");
    }

    switch (medium.type) {
      case "image":
        return (
          <Image
            ref={ref}
            className={className}
            medium={medium}
            dimensions={dimensions}
            objectFit={objectFit}
            copyright={copyright}
            activeElement={activeElement}
            mediaPairImage={mediaPairImage}
            onWidth={onWidth}
            isActive={isActive}
            showCrop={showCrop}
          />
        );
      case "video":
        return (
          <Video
            className={className}
            medium={medium}
            showControls={showControls}
            mediaPairImage={mediaPairImage}
            copyright={copyright}
            zoomOnHover={zoomOnHover}
          />
        );
      default:
        return null;
    }
  }
);

Media.displayName = "Media";
export default Media;
