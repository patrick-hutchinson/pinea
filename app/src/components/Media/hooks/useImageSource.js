import { useContext } from "react";

import { StateContext } from "@/context/StateContext";

const getCropRect = (medium) => {
  const crop = medium?.crop;
  const width = Number(medium?.width);
  const height = Number(medium?.height);

  if (!crop || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }

  const left = Math.max(0, Math.round(width * (crop.left || 0)));
  const top = Math.max(0, Math.round(height * (crop.top || 0)));
  const right = Math.max(0, Math.round(width * (crop.right || 0)));
  const bottom = Math.max(0, Math.round(height * (crop.bottom || 0)));

  const croppedWidth = Math.max(1, width - left - right);
  const croppedHeight = Math.max(1, height - top - bottom);

  return `${left},${top},${croppedWidth},${croppedHeight}`;
};

const buildImageUrl = (baseUrl, params = {}) => {
  if (baseUrl?.startsWith("/")) return baseUrl;

  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

export const buildMediaImageSource = (
  medium,
  dimensions,
  preferFullImage = false,
  isMobile = false,
  viewportWidth,
  devicePixelRatio,
) => {
  if (!medium?.url) return null;

  const cropRect = getCropRect(medium);
  // 1. Custom dimensions always take priority
  const hasCustomDimensions = Boolean(dimensions);

  if (hasCustomDimensions) {
    const fitMode = preferFullImage ? "max" : "crop";
    return buildImageUrl(medium.url, {
      rect: cropRect,
      w: dimensions.width,
      h: dimensions.height,
      fit: fitMode,
      auto: "format",
    });
  }

  if (!medium.width || !medium.height) {
    return medium.url;
  }

  const resolvedViewportWidth = viewportWidth || (typeof window !== "undefined" ? window.innerWidth : medium.width);
  const resolvedDevicePixelRatio = devicePixelRatio || (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);
  const cappedDpr = Math.min(resolvedDevicePixelRatio, 2);

  // Aim for quality on retina, but keep requests bounded to avoid iOS memory churn.
  const requestedWidth = Math.round(resolvedViewportWidth * cappedDpr * (isMobile ? 1.1 : 1.25));
  const maxWidth = isMobile ? 1400 : 2200;
  const targetWidth = Math.max(320, Math.min(medium.width, requestedWidth, maxWidth));

  return buildImageUrl(medium.url, {
    rect: cropRect,
    w: targetWidth,
    fit: "max",
    auto: "format",
  });
};

export const useImageSource = (medium, dimensions, preferFullImage = false) => {
  const { isMobile } = useContext(StateContext);
  return buildMediaImageSource(medium, dimensions, preferFullImage, isMobile);
};
