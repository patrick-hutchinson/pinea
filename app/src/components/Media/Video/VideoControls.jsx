"use client";

import styles from "../Media.module.css";

import CropButton from "../CropButton";

const VideoControls = ({ className, playerState, playerControls }) => {
  return (
    <div className={`${className}`} typo="h4">
      <div className={styles.duration}>
        {playerControls.progress == 0 ? "0:00" : playerControls.progress}/{playerControls.duration}
      </div>
      <button
        className={styles.playButton}
        onClick={(e) => {
          e.stopPropagation(); // 👈 prevent parent clicks
          e.preventDefault(); // ← This stops Next.js Link from navigating
          playerControls.setPaused((prevPaused) => !prevPaused);
        }}
      >
        {playerControls.paused ? "Play" : "Pause"}
      </button>
      <button
        className={styles.muteButton}
        onClick={(e) => {
          e.stopPropagation(); // 👈 prevent parent clicks
          e.preventDefault(); // ← This stops Next.js Link from navigating
          playerControls.setMuted((prevMuted) => !prevMuted);
        }}
      >
        {playerControls.muted ? "Unmute" : "Mute"}
      </button>

      <button
        className={styles.fullscreenButton}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          playerControls.enterFullscreen(); // call the passed-in function manually
        }}
      >
        Fullscreen
      </button>

      {playerState.showCrop && <CropButton className={styles.cropButton} setCropped={playerState.setCropped} />}
    </div>
  );
};

export default VideoControls;
