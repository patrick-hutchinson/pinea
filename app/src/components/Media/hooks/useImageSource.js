import { useContext } from "react";

import { StateContext } from "@/context/StateContext";

export const useImageSource = (medium, dimensions, preferFullImage = false) => {
  const { isMobile } = useContext(StateContext);
  // 1. Custom dimensions always take priority
  const hasCustomDimensions = Boolean(dimensions);

  if (hasCustomDimensions) {
    const fitMode = preferFullImage ? "max" : "crop";
    return `${medium.url}?w=${dimensions.width}&h=${dimensions.height}&fit=${fitMode}&auto=format`;
  }

  if (!medium.width || !medium.height) {
    return medium.url;
  }

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : medium.width;
  const devicePixelRatio = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const cappedDpr = Math.min(devicePixelRatio, 2);

  // Aim for quality on retina, but keep requests bounded to avoid iOS memory churn.
  const requestedWidth = Math.round(viewportWidth * cappedDpr * (isMobile ? 1.1 : 1.25));
  const maxWidth = isMobile ? 1400 : 2200;
  const targetWidth = Math.max(320, Math.min(medium.width, requestedWidth, maxWidth));

  return `${medium.url}?w=${targetWidth}&fit=max&auto=format`;
};
