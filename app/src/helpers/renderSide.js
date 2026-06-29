import { useCallback } from "react";

import Media from "@/components/Media/Media";
import MediaSlideshow from "@/components/Slideshow/MediaSlideshow";
import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";

export const renderSide = (side) => {
  if (!side) return null;

  const medium = side?.medium;
  const gallery = Array.isArray(medium?.gallery) ? medium.gallery.filter((item) => item?.medium) : [];
  const copyright = medium?.copyrightInternational;

  switch (side.type) {
    case "media":
      if (!medium) return null;

      return (
        <Media
          showCrop={true}
          medium={medium}
          copyright={<Text text={translate(copyright)} typo="h5" />}
          isActive={true}
          showControls={true}
        />
      );
    case "slideshow":
      if (gallery.length === 0) return null;
      return <MediaSlideshow media={gallery} showCrop={true} isActive={true} />;
    default:
      return null;
  }
};
