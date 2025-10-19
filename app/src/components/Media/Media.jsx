"use client";

import React from "react";
import Image from "./Image";
import Video from "./Video";

const Media = React.memo(({ medium, dimensions, objectFit }) => {
  switch (medium.type) {
    case "image":
      return <Image medium={medium} dimensions={dimensions} objectFit={objectFit} />;
    case "video":
      return <Video medium={medium} />;
    default:
      return null;
  }
});

Media.displayName = "Media";
export default Media;
