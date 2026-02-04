import NextImage from "next/image";

const PosterImage = ({ medium, aspectRatio = "auto", loadEager }) => {
  let src;

  medium.type === "image"
    ? (src = `${medium.url}?w=20&fit=crop&auto=format`)
    : (src = `https://image.mux.com/${medium.playbackId}/thumbnail.jpg?width=50`);

  return (
    <NextImage
      src={src}
      fill
      loading={loadEager ? "eager" : "lazy"}
      alt="placeholder image"
      style={{
        position: "absolute",
        aspectRatio: aspectRatio,
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,

        filter: "blur(30px) brightness(1.3)",
        transform: "scale(1.5)",
        opacity: 1,
      }}
    />
  );
};

export default PosterImage;
