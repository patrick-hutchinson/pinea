import MuxPlayer from "@mux/mux-player-react";

const Video = ({ medium, objectFit, playerState, playerControls }) => {
  const customObjectFit = objectFit ?? "cover";
  const fit = customObjectFit;

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
      objectFit={fit}
      fill
      style={{
        position: "relative",
        opacity: 1,
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
