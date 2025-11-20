"use client";

import styles from "./VideoControls.module.css";

const VideoControls = ({ duration, progress, paused, setPaused, muted, setMuted }) => (
  <div className={styles.video_controls} typo="h4">
    <span className={styles.duration}>
      {progress == duration ? "0:00" : progress}/{duration}
    </span>
    <button
      onClick={() => {
        setPaused((prevPaused) => !prevPaused);
      }}
    >
      {paused ? "PLAY" : "PAUSE"}
    </button>
    <button
      onClick={() => {
        setMuted((prevMuted) => !prevMuted);
      }}
    >
      {muted ? "UNMUTE" : "MUTE"}
    </button>
  </div>
);

export default VideoControls;
