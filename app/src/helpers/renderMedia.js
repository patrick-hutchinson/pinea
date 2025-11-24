import Media from "@/components/Media/Media";
import Slideshow from "@/components/Slideshow/Slideshow";

export const renderMedia = (block, useCopyrightOverlay, showControls) => {
  if (!block) return null;

  switch (block.type) {
    case "media":
      return <Media medium={block.medium} showCrop={true} isActive={true} showControls={showControls} />;
    case "slideshow":
      return (
        <Slideshow
          media={block.medium.gallery}
          showCrop={true}
          useCopyrightOverlay={useCopyrightOverlay}
          isActive={true}
        />
      );
    default:
      return null;
  }
};
