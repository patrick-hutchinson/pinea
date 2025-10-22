import NextImage from "next/image";

const Image = ({ medium, dimensions, objectFit, copyright }) => {
  const hasCustomDimensions = dimensions;
  const resizedSrc = `${medium.url}?w=${dimensions?.width}&h=${dimensions?.height}&fit=crop&auto=format`;
  const src = hasCustomDimensions ? resizedSrc : medium.url;

  const width = dimensions?.width || medium.width;
  const height = dimensions?.height || medium.height;

  const usePlaceholder = width > 40 || width > 40;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        aspectRatio: medium.width / medium.height,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <NextImage
        src={src}
        alt="image"
        unoptimized
        width={width}
        height={height}
        draggable={false}
        placeholder={usePlaceholder ? "blur" : "empty"}
        blurDataURL={usePlaceholder ? medium.lqip : null}
        style={{
          position: "relative",
          opacity: 1,
          zIndex: 0,
          width: "100%",
          height: "100%",
          objectFit: objectFit || "cover", // or cover?
        }}
      />
      <p typo="h5" style={{ position: "absolute", bottom: 8, left: 8, color: "#fff" }}>
        {copyright}
      </p>
    </div>
  );
};

export default Image;
