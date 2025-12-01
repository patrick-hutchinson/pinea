import MuxPlayer from "@mux/mux-player-react";

import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import NextImage from "next/image";
import VideoControls from "@/components/VideoControls/VideoControls";

import { motion } from "framer-motion";
import styles from "./Media.module.css";
import Copyright from "./Copyright";
import CropButton from "./CropButton";

const Video = ({
  medium,
  className,
  showControls,
  mediaPairImage,
  copyright,
  zoomOnHover,
  isActive,
  activeElement,
  showCrop,
}) => {
  const videoRef = useRef(null);
  const [cropped, setCropped] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mediaWidth, setMediaWidth] = useState(null);
  const playerRef = useRef(null);
  const isInView = useInView(videoRef, { once: true, margin: "0px 0px -100px 0px" });

  useEffect(() => {
    if (!videoRef?.current) return; // ✅ Prevents crash if ref not yet attached

    const videoWidth = videoRef.current.getBoundingClientRect().width;

    if (!videoWidth) return;

    setMediaWidth(videoWidth);
  }, [isLoaded, activeElement, isActive]);

  const rawVideoProps = {
    medium,
    className,
    showControls,
    mediaPairImage,
    copyright,
    zoomOnHover,
    isActive,
    activeElement,
    showCrop,
    mediaWidth,
    cropped,
    setCropped,
    videoRef,
    isLoaded,
    setIsLoaded,
    isInView,
    playerRef,
  };

  return copyright && mediaPairImage ? (
    <MediaPairVideo {...rawVideoProps} />
  ) : copyright && !mediaPairImage ? (
    <CopyrightedVideo {...rawVideoProps} />
  ) : (
    <RawVideo {...rawVideoProps} />
  );
};

const RawVideo = ({
  medium,
  className,
  showControls,
  mediaPairImage,
  copyright,
  zoomOnHover,
  isActive,
  activeElement,
  showCrop,
  videoRef,
  isLoaded,
  setIsLoaded,
  isInView,
  hideCropButton,
  playerRef,
  cropped,
  setCropped,
}) => {
  const [aspectWidth, aspectHeight] = medium.aspect_ratio.split(":");

  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(true);
  const [duration, setDuration] = useState(true);

  const fit = showCrop ? (cropped === true ? "contain" : "cover") : "cover";

  let lastUpdate = 0;

  function handleTime(e) {
    if (!setProgress) return;

    const now = Date.now();
    if (now - lastUpdate > 1000) {
      setProgress(formatTime(Math.round(e.target.currentTime)));
      lastUpdate = now;
    }
  }

  function handleDuration(e) {
    if (!setDuration) return;

    setDuration(formatTime(Math.floor(e.target.duration)));
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  const mediaVariants = {
    idle: { scale: 1, transition: "easeInOut" },
    hovered: { scale: 1.1, transition: "easeInOut" },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        aspectRatio: aspectWidth / aspectHeight,
        overflow: "hidden",
        position: "relative",
      }}
      ref={videoRef}
      className={className}
    >
      {showCrop && !hideCropButton && <CropButton setCropped={setCropped} cropped={cropped} />}
      <motion.div
        variants={mediaVariants}
        initial="idle" // start in idle
        whileHover={zoomOnHover && "hovered"} // switch to hovered on hover
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
            muted={muted ?? true}
            paused={paused ? paused : false}
            playsInline
            fill
            style={{
              "--media-object-fit": fit,
              position: "relative",
              opacity: 1,
              zIndex: 0,
              width: "100%",
              height: "100%",
              objectFit: fit,
            }}
            onLoadedData={() => setIsLoaded(true)}
            onTimeUpdate={(e) => handleTime(e)}
            onLoadedMetadata={(e) => handleDuration(e)}
          />
        )}
      </motion.div>
      {showControls && (
        <VideoControls
          className={styles.controls}
          muted={muted}
          setMuted={setMuted}
          paused={paused}
          setPaused={setPaused}
          duration={duration}
          progress={progress}
        />
      )}
    </div>
  );
};

const MediaPairVideo = ({
  copyright,
  mediaWidth,
  activeElement,
  showCrop,
  medium,
  cropped,
  isActive,
  setCropped,
  ...props
}) => {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }} className={styles.media_container}>
      {showCrop && <CropButton setCropped={setCropped} cropped={cropped} />}

      <div style={{ overflow: "hidden", width: "100%", height: "100%", position: "relative" }}>
        <NextImage
          src={`https://image.mux.com/${medium.playbackId}/thumbnail.jpg?width=50`}
          fill
          alt="placeholder image"
          style={{
            opacity: 1,

            filter: "blur(30px)",
            transform: "scale(1.5)",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <motion.div>
          <RawVideo
            {...props}
            cropped={cropped}
            setCropped={setCropped}
            showCrop={showCrop}
            hideCropButton={true}
            medium={medium}
          />
        </motion.div>
      </div>

      <Copyright
        copyright={copyright}
        mediaWidth={mediaWidth}
        activeElement={activeElement}
        isActive={isActive}
        className={styles.slideshow_copyright}
      />
    </div>
  );
};

const CopyrightedVideo = ({
  copyright,
  mediaWidth,
  activeElement,
  isActive,
  showCrop,
  setCropped,
  cropped,
  ...props
}) => {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }} className={`${styles.media_container} YES`}>
      {showCrop && <CropButton setCropped={setCropped} cropped={cropped} />}

      <RawVideo {...props} cropped={cropped} setCropped={setCropped} showCrop={showCrop} hideCropButton={true} />
      <Copyright
        copyright={copyright}
        mediaWidth={mediaWidth}
        activeElement={activeElement}
        isActive={isActive}
        isVideo={true}
        className={styles.slideshow_copyright}
      />
    </div>
  );
};

export default Video;
