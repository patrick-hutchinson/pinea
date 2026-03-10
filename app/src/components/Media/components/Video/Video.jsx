import MuxPlayer from "@mux/mux-player-react";

const Video = ({ medium, objectFit, playerState, playerControls, shouldMount = true, loadEager = false }) => {
  const customObjectFit = objectFit ?? "cover";
  const fit = customObjectFit;

  if (!shouldMount) return null;

  return (
    <MuxPlayer
      ref={playerControls.playerRef}
      playbackId={medium.playbackId}
      autoPlay
      controls={false}
      loop
      muted={playerControls.muted ?? true}
      preload={loadEager ? "auto" : "metadata"}
      paused={playerControls.paused ? playerControls.paused : false}
      playsInline
      objectFit={fit}
      fill
      style={{
        position: "relative",
        opacity: playerState.isLoaded ? 1 : 0,
        transition: "opacity 240ms ease",
        zIndex: 0,
        width: "100%",
        height: "100%",
        "--media-object-fit": fit,
        "--media-object-position": "center center",
        objectFit: fit,
        objectPosition: "center center",
      }}
      onPlaying={() => playerState.setIsLoaded(true)}
      onTimeUpdate={playerControls.onTimeUpdate}
      onLoadedMetadata={playerControls.onLoadedMetadata}
    />
  );
};

export default Video;
