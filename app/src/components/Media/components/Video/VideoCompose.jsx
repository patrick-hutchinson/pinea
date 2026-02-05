import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import { useVideoPlayer } from "@/components/Media/hooks/useVideoPlayer";
import { useMediaDimensions } from "@/components/Media/hooks/useMediaDimensions";

import VideoControls from "./VideoControls";
import ZoomMediaWrapper from "@/components/Animation/ZoomMediaWrapper";
import Copyright from "@/components/Media/components/Copyright/Copyright";
import PosterImage from "@/components/Media/components/PosterImage";
import Video from "./Video";

import styles from "../../Media.module.css";

const VideoFrame = ({
  medium,
  className,
  showControls,
  copyright,
  zoomOnHover,
  isActive,
  objectFit,
  activeElement,
  showCrop,
  loadEager,
}) => {
  const videoRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [cropped, setCropped] = useState(false);

  // Calculate the media's width upon loading

  const playerControls = useVideoPlayer();

  const { mediaWidth, mediaHeight } = useMediaDimensions(playerControls.playerRef, [isLoaded, activeElement, isActive]);

  const [aspectWidth, aspectHeight] = medium.aspect_ratio.split(":");
  const aspectRatio = aspectWidth / aspectHeight;

  const isInView = useInView(playerControls.playerRef, { once: true, margin: "0px 0px -100px 0px" });
  const playerState = { cropped, setCropped, showCrop, isLoaded, setIsLoaded, isInView };

  return (
    <div className={styles.mediaContainer}>
      <div className={styles.mediaContainer_inner}>
        {showCrop && <PosterImage medium={medium} />}

        <div
          ref={playerControls.playerRef}
          className={`${className} ${styles.videoPlayer}`}
          style={{
            aspectRatio: aspectRatio,
            overflow: "hidden",
          }}
        >
          <ZoomMediaWrapper zoomOnHover={zoomOnHover}>
            {!isLoaded && <PosterImage medium={medium} aspectRatio={aspectRatio} loadEager={loadEager} />}
            <Video medium={medium} objectFit={objectFit} playerState={playerState} playerControls={playerControls} />
          </ZoomMediaWrapper>

          {showControls && (
            <VideoControls className={styles.videoControls} playerState={playerState} playerControls={playerControls} />
          )}
        </div>
      </div>

      {copyright && (
        <Copyright copyright={copyright} mediaWidth={mediaWidth} activeElement={activeElement} isActive={isActive} />
      )}
    </div>
  );
};

export default VideoFrame;
