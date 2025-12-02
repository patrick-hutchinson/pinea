"use client";

import { useContext } from "react";
import styles from "./VideoControls.module.css";

import { StateContext } from "@/context/StateContext";

const VideoControls = ({ duration, progress, paused, setPaused, muted, setMuted, className, enterFullscreen }) => {
  const { isMobile } = useContext(StateContext);
  return (
    <div className={`${className} ${styles.video_controls}`} typo="h4">
      <div className={styles.duration}>
        {progress == duration ? "0:00" : progress}/{duration}
      </div>
      <button
        className={styles.play}
        onClick={(e) => {
          e.stopPropagation(); // 👈 prevent parent clicks
          e.preventDefault(); // ← This stops Next.js Link from navigating
          setPaused((prevPaused) => !prevPaused);
        }}
      >
        {paused ? "Play" : "Pause"}
      </button>
      <button
        className={styles.mute}
        onClick={(e) => {
          e.stopPropagation(); // 👈 prevent parent clicks
          e.preventDefault(); // ← This stops Next.js Link from navigating
          setMuted((prevMuted) => !prevMuted);
        }}
      >
        {muted ? "Unmute" : "Mute"}
      </button>

      {isMobile && (
        <button
          className={styles.fullscreen}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            enterFullscreen(); // call the passed-in function manually
          }}
        >
          Fullscreen
        </button>
      )}
    </div>
  );
};

export default VideoControls;
