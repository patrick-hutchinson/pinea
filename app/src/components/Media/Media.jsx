"use client";

import { forwardRef } from "react";

import ImageCompose from "./components/Image/ImageCompose";
import VideoCompose from "./components/Video/VideoCompose";

const Media = forwardRef(
  (
    {
      medium,
      dimensions,
      loadEager,
      objectFit,
      copyright,
      className,
      activeElement,

      onWidth,
      isActive,
      showControls,
      zoomOnHover,
      showCrop,
    },
    ref,
  ) => {
    if (!medium || (!medium.url && !medium.playbackId)) return undefined;

    switch (medium.type) {
      case "image":
        return (
          <ImageCompose
            ref={ref}
            medium={medium}
            dimensions={dimensions}
            loadEager={loadEager}
            objectFit={objectFit}
            copyright={copyright}
            activeElement={activeElement}
            onWidth={onWidth}
            isActive={isActive}
            showCrop={showCrop}
            zoomOnHover={zoomOnHover}
          />
        );
      case "video":
        return (
          <VideoCompose
            className={className}
            medium={medium}
            loadEager={loadEager}
            showControls={showControls}
            copyright={copyright}
            zoomOnHover={zoomOnHover}
            isActive={isActive}
            activeElement={activeElement}
            showCrop={showCrop}
            objectFit={objectFit}
          />
        );
      default:
        return null;
    }
  },
);

Media.displayName = "Media";
export default Media;
