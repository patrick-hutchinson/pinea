import MuxPlayer from "@mux/mux-player-react";

const Video = ({ medium, objectFit, playerState, playerControls }) => {
  const customObjectFit = objectFit ?? "cover";
  const fit = playerState.showCrop ? (playerState.cropped === true ? "contain" : customObjectFit) : customObjectFit;

  if (!playerState.isInView) return null;

  return (
    <MuxPlayer
      ref={playerControls.playerRef}
      playbackId={medium.playbackId}
      autoPlay
      controls={false}
      loop
      muted={playerControls.muted ?? true}
      paused={playerControls.paused ? playerControls.paused : false}
      playsInline
      objectFit={objectFit}
      fill
      style={{
        position: "relative",
        opacity: 1,
        zIndex: 0,
        width: "100%",
        height: "100%",
        "--media-object-fit": fit,
        objectFit: fit,
      }}
      onPlaying={() => playerState.setIsLoaded(true)}
      onTimeUpdate={playerControls.onTimeUpdate}
      onLoadedMetadata={playerControls.onLoadedMetadata}
    />
  );
};

export default Video;
