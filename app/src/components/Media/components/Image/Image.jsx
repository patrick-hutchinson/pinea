import { useImageSource } from "../../hooks/useImageSource";
import NextImage from "next/image";

const Image = ({
  medium,
  dimensions,
  resolvedObjectFit,
  preferFullImage = false,
  imageRef,
  loadEager,
  setIsLoaded,
  isLoaded,
  disableLoadFade = false,
}) => {
  const imageSource = useImageSource(medium, dimensions, preferFullImage);

  const resolutionWidth = dimensions?.width || medium.width;
  const resolutionHeight = dimensions?.height || medium.height;
  const usePlaceholder = resolutionWidth > 40;

  return (
    <div
      ref={imageRef}
      style={{
        width: "100%",
        height: "100%",
        aspectRatio: resolutionWidth / resolutionHeight,
        position: "relative",
      }}
    >
      <NextImage
        src={imageSource}
        onContextMenu={(e) => e.preventDefault()}
        alt="image"
        unoptimized
        width={resolutionWidth}
        height={resolutionHeight}
        loading={loadEager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={loadEager ? "high" : undefined}
        draggable={false}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          objectFit: resolvedObjectFit,
          objectPosition: "center",
          opacity: disableLoadFade || isLoaded ? 1 : 0,
          transition: disableLoadFade ? "none" : "opacity 240ms ease",
        }}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default Image;
