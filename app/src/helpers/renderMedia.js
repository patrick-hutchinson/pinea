import Media from "@/components/Media/Media";
import Slideshow from "@/components/Slideshow/Slideshow";

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
            mediaPairImage={block.medium.copyrightInternational}
          />
          {useCopyrightOverlay && (
            <CopyrightHover
              copyright={<Text text={translate(block.medium.copyrightInternational)} typo="h5" />}
              className="COPYRIGHT"
            />
          )}
        </>
      );
    case "slideshow":
      return (
        <Slideshow
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
            mediaPairImage={block.medium.copyrightInternational}
          />
          {useCopyrightOverlay && (
            <CopyrightHover
              copyright={<Text text={translate(block.medium.copyrightInternational)} typo="h5" />}
              className="COPYRIGHT"
            />
          )}
        </>
      );
  }
};
