import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import VideoControls from "@/components/Media/Video/VideoControls";
import { useVideoPlayer } from "@/components/Media/hooks/useVideoPlayer";

import ZoomMediaWrapper from "../Animation/ZoomMediaWrapper";

import styles from "./Media.module.css";
import Copyright from "./Copyright";

import { useMediaDimensions } from "./hooks/useMediaDimensions";

import PosterImage from "./Video/PosterImage";
import VideoPlayer from "./Video/VideoPlayer";

const Video = ({
  medium,
  className,
  showControls,
  copyright,
  zoomOnHover,
  isActive,
  objectFit,
  activeElement,
  showCrop,
}) => {
  const videoRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [cropped, setCropped] = useState(false);

  const isInView = useInView(videoRef, { once: true, margin: "0px 0px -100px 0px" });

  // Calculate the media's width upon loading
  const { mediaWidth, mediaHeight } = useMediaDimensions(videoRef, [isLoaded, activeElement, isActive]);

  const [aspectWidth, aspectHeight] = medium.aspect_ratio.split(":");
  const aspectRatio = aspectWidth / aspectHeight;

  const playerState = { cropped, setCropped, showCrop, isLoaded, setIsLoaded, isInView };

  const playerControls = useVideoPlayer();

  return (
    <div className={styles.videoContainer}>
      <div style={{ overflow: "hidden", width: "100%", height: "100%", position: "relative" }}>
        <PosterImage medium={medium} />

        <div ref={videoRef} className={`${className} ${styles.videoPlayer}`} style={{ aspectRatio: aspectRatio }}>
          <ZoomMediaWrapper zoomOnHover={zoomOnHover}>
            {!isLoaded && <PosterImage medium={medium} />}
            <VideoPlayer
              medium={medium}
              objectFit={objectFit}
              playerState={playerState}
              playerControls={playerControls}
            />
          </ZoomMediaWrapper>

          {showControls && (
            <VideoControls className={styles.videoControls} playerState={playerState} playerControls={playerControls} />
          )}
        </div>
      </div>

      {copyright && (
        <Copyright
          copyright={copyright}
          mediaWidth={mediaWidth}
          activeElement={activeElement}
          isActive={isActive}
          className={styles.slideshow_copyright}
        />
      )}
    </div>
  );
};

export default Video;
