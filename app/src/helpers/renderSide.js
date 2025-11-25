import { useCallback } from "react";

import Media from "@/components/Media/Media";
import Slideshow from "@/components/Slideshow/Slideshow";
import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";

export const renderSide = (side) => {
  if (!side) return null;

  const hasCopyright = side.medium.copyrightInternational;

  switch (side.type) {
    case "media":
      return (
        <Media
          showCrop={true}
          medium={side.medium}
          copyright={<Text text={translate(side.medium.copyrightInternational)} typo="h5" />}
          mediaPairImage={hasCopyright && true}
          isActive={true}
        />
      );
    case "slideshow":
      return <Slideshow media={side.medium.gallery} showCrop={true} isActive={true} />;
    default:
      return null;
  }
};
