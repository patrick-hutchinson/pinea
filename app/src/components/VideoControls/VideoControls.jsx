"use client";

import styles from "./VideoControls.module.css";

const VideoControls = ({ duration, progress, paused, setPaused, muted, setMuted, className }) => (
  <div className={`${className} ${styles.video_controls}`} typo="h4">
    <span className={styles.duration}>
      {progress == duration ? "0:00" : progress}/{duration}
    </span>
    <button
      onClick={() => {
        setPaused((prevPaused) => !prevPaused);
      }}
    >
      {paused ? "Play" : "Pause"}
    </button>
    <button
      onClick={() => {
        setMuted((prevMuted) => !prevMuted);
      }}
    >
      {muted ? "Unmute" : "Mute"}
    </button>
  </div>
);

export default VideoControls;
