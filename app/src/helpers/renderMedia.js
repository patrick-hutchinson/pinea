import Media from "@/components/Media/Media";
import MediaSlideshow from "@/components/Slideshow/MediaSlideshow";

import Text from "@/components/Text/Text";
import { translate } from "@/helpers/translate";

import CopyrightHover from "@/components/CopyrightHover/CopyrightHover";

export const renderMedia = (block, useCopyrightOverlay, showControls) => {
  if (!block) return null;

  switch (block.type) {
    case "media":
      return (
        <>
          <Media
            medium={block.medium}
            showCrop={true}
            isActive={true}
            showControls={true}
            useCopyrightOverlay={useCopyrightOverlay}
            copyright={<Text text={translate(block.medium.copyrightInternational)} typo="h5" />}
          />
          {useCopyrightOverlay && (
            <CopyrightHover copyright={<Text text={translate(block.medium.copyrightInternational)} typo="h5" />} />
          )}
        </>
      );
    case "slideshow":
      return (
        <MediaSlideshow
          media={block.medium.gallery}
          showCrop={true}
          isActive={true}
          useCopyrightOverlay={useCopyrightOverlay}
        />
      );
    default:
      return (
        <>
          <Media
            medium={block.medium}
            showCrop={true}
            isActive={true}
            showControls={true}
            useCopyrightOverlay={useCopyrightOverlay}
            copyright={<Text text={translate(block.medium.copyrightInternational)} typo="h5" />}
          />
          {useCopyrightOverlay && (
            <CopyrightHover copyright={<Text text={translate(block.medium.copyrightInternational)} typo="h5" />} />
          )}
        </>
      );
  }
};
