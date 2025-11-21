import MuxPlayer from "@mux/mux-player-react";

import { useInView } from "framer-motion";
import { useRef, useState } from "react";

import NextImage from "next/image";
import VideoControls from "@/components/VideoControls/VideoControls";

import { motion } from "framer-motion";
import styles from "./Media.module.css";

const Video = ({ medium, className, showControls, mediaPairImage, copyright, zoomOnHover }) => {
  const videoRef = useRef(null);
  const [aspectWidth, aspectHeight] = medium.aspect_ratio.split(":");

  const [isLoaded, setIsLoaded] = useState(false);
  const playerRef = useRef(null);
  const isInView = useInView(videoRef, { once: true, margin: "0px 0px -100px 0px" });

  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(true);
  const [duration, setDuration] = useState(true);

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

  // const RawVideo = () => (
  //   <div
  //     className={className}
  //     ref={videoRef}
  //     style={{
  //       width: "100%",
  //       height: "100%",
  //       aspectRatio: aspectWidth / aspectHeight,
  //       overflow: "hidden",
  //       position: "relative",
  //     }}
  //   >
  //     {showControls && (
  //       <VideoControls
  //         className={styles.controls}
  //         muted={muted}
  //         setMuted={setMuted}
  //         paused={paused}
  //         setPaused={setPaused}
  //         duration={duration}
  //         progress={progress}
  //       />
  //     )}
  //     {!isLoaded && (
  //       <NextImage
  //         src={`https://image.mux.com/${medium.playbackId}/thumbnail.jpg?width=50`}
  //         fill
  //         alt="placeholder image"
  //         style={{
  //           opacity: isLoaded ? 0 : 1,
  //           zIndex: 1,
  //           filter: "blur(30px)",
  //           transform: "scale(1.8)",
  //         }}
  //       />
  //     )}
  //     {isInView && (
  //       <MuxPlayer
  //         ref={playerRef}
  //         playbackId={medium.playbackId}
  //         autoPlay
  //         controls={false}
  //         loop
  //         muted={muted ?? true}
  //         paused={paused ? paused : false}
  //         playsInline
  //         fill
  //         style={{
  //           "--media-object-fit": "cover", // ✅ ensures cropping/fill behavior
  //           position: "relative",
  //           opacity: 1,
  //           zIndex: 0,
  //           width: "100%",
  //           height: "100%",
  //           objectFit: "cover",
  //         }}
  //         onLoadedData={() => setIsLoaded(true)}
  //         onTimeUpdate={(e) => handleTime(e)}
  //         onLoadedMetadata={(e) => handleDuration(e)}
  //       />
  //     )}
  //   </div>
  // );

  const mediaVariants = {
    idle: { scale: 1, transition: "easeInOut" },
    hovered: { scale: 1.2, transition: "easeInOut" },
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
              "--media-object-fit": "cover", // ✅ ensures cropping/fill behavior
              position: "relative",
              opacity: 1,
              zIndex: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onLoadedData={() => setIsLoaded(true)}
            onTimeUpdate={(e) => handleTime(e)}
            onLoadedMetadata={(e) => handleDuration(e)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Video;
