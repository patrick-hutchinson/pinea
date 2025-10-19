import MuxPlayer from "@mux/mux-player-react";

import { useInView } from "framer-motion";
import { useRef, useState } from "react";

import NextImage from "next/image";

const Video = ({ medium }) => {
  console.log(medium, "video");
  const videoRef = useRef(null);
  const [aspectWidth, aspectHeight] = medium.aspect_ratio.split(":");

  const [isLoaded, setIsLoaded] = useState(false);
  const playerRef = useRef(null);
  const isInView = useInView(videoRef, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <div
      ref={videoRef}
      style={{
        width: "100%",
        height: "100%",
        aspectRatio: aspectWidth / aspectHeight,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {!isLoaded && (
        <NextImage
          src={`https://image.mux.com/${medium.playbackId}/thumbnail.jpg?width=50`}
          fill
          alt="placeholder image"
          style={{
            opacity: isLoaded ? 0 : 1,
            zIndex: 1,
            filter: "blur(30px)",
            transform: "scale(1.8)",
          }}
        />
      )}
      {isInView && (
        <MuxPlayer
          ref={playerRef}
          playbackId={medium.playbackId}
          autoPlay
          controls={false}
          loop
          muted
          playsInline
          fill
          style={{
            position: "relative",
            opacity: 1,
            zIndex: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onLoadedData={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};

export default Video;
