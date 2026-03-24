import NextImage from "next/image";

const Placeholder = ({ medium, aspectRatio = "auto", loadEager, isLoaded }) => {
  const src =
    medium?.placeholderUrl ||
    (medium.type === "image"
      ? `${medium.url}?w=20&fit=crop&auto=format`
      : medium?.playbackId
        ? `https://image.mux.com/${medium.playbackId}/thumbnail.jpg?width=50`
        : null);

  if (!src) return null;

  return (
    <NextImage
      src={src}
      fill
      loading={loadEager ? "eager" : "lazy"}
      alt="placeholder image"
      draggable={false}
      style={{
        position: "absolute",
        aspectRatio: aspectRatio,
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        filter: "blur(20px) brightness(1.3)",
        transform: "scale(1.5)",
        opacity: isLoaded ? 0 : 1,
        transition: "opacity 0.5s ease 0.5s",
        zIndex: 3,
      }}
    />
  );
};

export default Placeholder;
