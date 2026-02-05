import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import { useVideoPlayer } from "@/components/Media/hooks/useVideoPlayer";
import { useMediaDimensions } from "@/components/Media/hooks/useMediaDimensions";

import VideoControls from "./VideoControls";
import ZoomMediaWrapper from "@/components/Animation/ZoomMediaWrapper";
import Copyright from "@/components/Media/components/Copyright/Copyright";
import PosterImage from "@/components/Media/components/PosterImage";
import Video from "./Video";
import Placeholder from "../Placeholder";

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

  const isInView = useInView(videoRef, { once: true, margin: "0px 0px -100px 0px" });

  // Calculate the media's width upon loading
  const { mediaWidth, mediaHeight } = useMediaDimensions(videoRef, [isLoaded, activeElement, isActive]);

  const [aspectWidth, aspectHeight] = medium.aspect_ratio.split(":");
  const aspectRatio = aspectWidth / aspectHeight;

  const playerState = { cropped, setCropped, showCrop, isLoaded, setIsLoaded, isInView };

  const playerControls = useVideoPlayer();

  return (
    <div className={styles.mediaContainer}>
      <div className={styles.mediaContainer_inner}>
        {showCrop && <PosterImage medium={medium} />}

        <div
          ref={videoRef}
          className={`${className} ${styles.videoPlayer}`}
          style={{
            aspectRatio: aspectRatio,
            overflow: "hidden",
          }}
        >
          <ZoomMediaWrapper zoomOnHover={zoomOnHover}>
            <Placeholder medium={medium} aspectRatio={aspectRatio} loadEager={loadEager} isLoaded={isLoaded} />
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
