import NextImage from "next/image";

const PosterImage = ({ medium }) => {
  return (
    <NextImage
      src={`https://image.mux.com/${medium.playbackId}/thumbnail.jpg?width=50`}
      fill
      alt="placeholder image"
      style={{
        position: "absolute",

        width: "100%",
        height: "100%",
        top: 0,
        left: 0,

        filter: "blur(30px)",
        transform: "scale(1.5)",
        opacity: 1,
      }}
    />
  );
};

export default PosterImage;
