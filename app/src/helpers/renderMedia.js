import Media from "@/components/Media/Media";
import MediaSlideshow from "@/components/Slideshow/MediaSlideshow";

import Text from "@/components/Text/Text";
import { translate } from "@/helpers/translate";

import CopyrightHover from "@/components/CopyrightHover/CopyrightHover";

export const renderMedia = (block, useCopyrightOverlay, showControls) => {
  if (!block) return null;
  const medium = block?.medium;
  const gallery = Array.isArray(medium?.gallery) ? medium.gallery.filter((item) => item?.medium) : [];
  const copyright = medium?.copyrightInternational;

  switch (block.type) {
    case "media":
      if (!medium) return null;

      return (
        <>
          <Media
            medium={medium}
            showCrop={true}
            isActive={true}
            showControls={true}
            useCopyrightOverlay={useCopyrightOverlay}
            copyright={<Text text={translate(copyright)} typo="h5" />}
          />
          {useCopyrightOverlay && (
            <CopyrightHover copyright={<Text text={translate(copyright)} typo="h5" />} />
          )}
        </>
      );
    case "slideshow":
      if (gallery.length === 0) return null;

      return (
        <MediaSlideshow
          media={gallery}
          showCrop={true}
          isActive={true}
          useCopyrightOverlay={useCopyrightOverlay}
        />
      );
    default:
      if (!medium) return null;

      return (
        <>
          <Media
            medium={medium}
            showCrop={true}
            isActive={true}
            showControls={true}
            useCopyrightOverlay={useCopyrightOverlay}
            copyright={<Text text={translate(copyright)} typo="h5" />}
          />
          {useCopyrightOverlay && (
            <CopyrightHover copyright={<Text text={translate(copyright)} typo="h5" />} />
          )}
        </>
      );
  }
};
