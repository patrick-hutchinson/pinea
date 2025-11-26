"use client";

import styles from "./VideoControls.module.css";

const VideoControls = ({ duration, progress, paused, setPaused, muted, setMuted, className }) => (
  <div className={`${className} ${styles.video_controls}`} typo="h4">
    <span className={styles.duration}>
      {progress == duration ? "0:00" : progress}/{duration}
    </span>
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
  </div>
);

export default VideoControls;
