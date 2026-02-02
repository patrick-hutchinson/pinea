import { useEffect, useState } from "react";

export const useMediaDimensions = (ref, dependencies = []) => {
  const [mediaWidth, setMediaWidth] = useState(null);
  const [mediaHeight, setMediaHeight] = useState(null);

  useEffect(() => {
    if (!ref?.current) return;

    const { width, height } = ref.current.getBoundingClientRect();

    if (width) setMediaWidth(width);
    if (height) setMediaHeight(height);
  }, dependencies);

  return { mediaWidth, mediaHeight };
};
