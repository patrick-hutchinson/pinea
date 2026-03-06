import { useInView } from "framer-motion";
import { useRef, useState, useEffect, useContext } from "react";

import { useVideoPlayer } from "@/components/Media/hooks/useVideoPlayer";
import { useMediaDimensions } from "@/components/Media/hooks/useMediaDimensions";

import VideoControls from "./VideoControls";
import ZoomMediaWrapper from "@/components/Animation/ZoomMediaWrapper";
import Copyright from "@/components/Media/components/Copyright/Copyright";
import PosterImage from "@/components/Media/components/PosterImage";
import Video from "./Video";
import Placeholder from "../Placeholder";
import { StateContext } from "@/context/StateContext";

import styles from "../../Media.module.css";

const parseAspectRatio = (medium) => {
  if (!medium) return 1;
  if (typeof medium.aspect_ratio === "string" && medium.aspect_ratio.includes(":")) {
    const [w, h] = medium.aspect_ratio.split(":").map(Number);
    if (Number.isFinite(w) && Number.isFinite(h) && h > 0) return w / h;
  }
  if (Number.isFinite(medium.width) && Number.isFinite(medium.height) && medium.height > 0) {
    return medium.width / medium.height;
  }
  return 1;
};

const VideoCompose = ({
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
  onWidth,
  disableTapCopyright,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const { isMobile } = useContext(StateContext);
  const videoRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [cropped, setCropped] = useState(false);

  const isInView = useInView(videoRef, { once: true, margin: "0px 0px -100px 0px" });

  // Calculate the media's width upon loading
  const { mediaWidth, mediaHeight } = useMediaDimensions(videoRef, [isLoaded, activeElement, isActive]);

  useEffect(() => {
    if (!onWidth || !mediaWidth) return;
    onWidth(mediaWidth);
  }, [onWidth, mediaWidth]);

  const aspectRatio = parseAspectRatio(medium);

  const getFitFrameSize = (mode) => {
    if (!mediaWidth || !mediaHeight) return null;
    const containerAspectRatio = mediaWidth / mediaHeight;
    const shouldUseWidth = mode === "contain" ? aspectRatio > containerAspectRatio : aspectRatio < containerAspectRatio;

    if (shouldUseWidth) {
      const width = mediaWidth;
      const height = width / aspectRatio;
      return { width, height };
    }

    const height = mediaHeight;
    const width = height * aspectRatio;
    return { width, height };
  };

  const fitFrameSize = showCrop ? getFitFrameSize(cropped ? "contain" : "cover") : null;
  const fitFrameStyle =
    showCrop && fitFrameSize
      ? {
          width: `${fitFrameSize.width}px`,
          height: `${fitFrameSize.height}px`,
        }
      : {};

  const playerState = { cropped, setCropped, showCrop, isLoaded, setIsLoaded, isInView };

  const playerControls = useVideoPlayer();

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  useEffect(() => {
    if (!isMobile) setIsTapped(false);
  }, [isMobile]);

  return (
    <div
      className={styles.mediaContainer}
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
      onClick={() => {
        if (!isMobile || disableTapCopyright) return;
        setIsTapped((prev) => !prev);
      }}
    >
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
            {showCrop ? (
              <div className={styles.fitFrame} style={fitFrameStyle}>
                <Video medium={medium} objectFit="cover" playerState={playerState} playerControls={playerControls} />
              </div>
            ) : (
              <Video medium={medium} objectFit={objectFit} playerState={playerState} playerControls={playerControls} />
            )}
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
          isHovered={isHovered}
          isTapped={isTapped}
        />
      )}
    </div>
  );
};

export default VideoCompose;
