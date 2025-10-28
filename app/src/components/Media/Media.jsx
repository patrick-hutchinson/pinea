"use client";

import { forwardRef } from "react";

import React from "react";
import Image from "./Image";
import Video from "./Video";

const Media = forwardRef(({ medium, dimensions, objectFit, copyright, className, handleLoaded }, ref) => {
  if (!medium || (!medium.url && !medium.playbackId)) return undefined;

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
          handleLoaded={handleLoaded}
        />
      );
    case "video":
      return <Video className={className} medium={medium} />;
    default:
      return null;
  }
});

Media.displayName = "Media";
export default Media;
