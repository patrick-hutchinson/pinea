"use client";

import React, { useRef, useState, useContext } from "react";

import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";

import { useInView } from "framer-motion";
import { StateContext } from "@/context/StateContext";

import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/client";

const Media = React.memo(({ medium, dimensions, objectFit }) => {
  if (!medium) return null; // Handle early return

  const { deviceDimensions } = useContext(StateContext);

  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const isInView = useInView(videoRef, { once: true, margin: "0px 0px -100px 0px" });

  const getMediaStyle = (mediaAspectRatio) => {
    const deviceAspectRatio = deviceDimensions.width / deviceDimensions.height;

    // Fit width is only relevant for fullscreen Content
    const fitWidth = mediaAspectRatio > deviceAspectRatio;

    return {
      width: "100%",
      height: "100%",
      aspectRatio: mediaAspectRatio,
      overflow: "hidden",
      position: "relative",
    };
  };

  const src = dimensions
    ? `${medium.url}?w=${dimensions.width}&h=${dimensions.height}&fit=crop&auto=format`
    : medium.url;

  // Handle Sanity Image
  if (medium.type === "image") {
    const width = dimensions?.width || medium.width;
    const height = dimensions?.height || medium.height;

    return (
      <div style={getMediaStyle(medium.width / medium.height)}>
        <Image
          src={src}
          alt="image"
          unoptimized
          width={width}
          height={height}
          draggable={false}
          placeholder="blur"
          blurDataURL={medium.lqip}
          style={{
            position: "relative",
            opacity: 1,
            zIndex: 0,
            width: "100%",
            height: "100%",
            objectFit: objectFit || "cover", // or cover?
          }}
        />
      </div>
    );
  }

  // Handle Sanity Video
  if (medium.type === "video") {
    const [aspectWidth, aspectHeight] = medium.aspect_ratio.split(":");

    return (
      <div ref={videoRef} style={getMediaStyle(aspectWidth / aspectHeight)}>
        {!isLoaded && (
          <Image
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
  }
});

Media.displayName = "Media";
export default Media;
