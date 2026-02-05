"use client";

import CropButton from "@/components/Media/components/CropButton";

import styles from "../../Media.module.css";
import { useContext } from "react";
import { StateContext } from "@/context/StateContext";

const VideoControls = ({ className, playerState, playerControls }) => {
  const { isMobile } = useContext(StateContext);
  return (
    <div className={`${className}`} typo="h4">
      {!isMobile && (
        <>
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
        </>
      )}

      {isMobile && (
        <button
          className={styles.fullscreenButton}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            playerControls.enterFullscreen(); // call the passed-in function manually
          }}
        >
          <img
            src="/icons/crop.png"
            style={{
              position: "absolute",
              bottom: "0",
              right: "var(--margin)",
              cursor: "pointer",
              height: "16px",
              width: "16px",

              zIndex: 1,
              fontSize: "var(--font-size-5)",

              lineHeight: 1,
              display: "flex",
              verticalAlign: "center",
            }}
            className={styles.icon}
          />
        </button>
      )}

      {playerState.showCrop && !isMobile && <CropButton className={styles.cropButton} setCropped={playerState.setCropped} />}
    </div>
  );
};

export default VideoControls;
