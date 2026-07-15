import { useEffect, useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { getMuxPosterUrl, getVideoSourceUrl, hasMuxStaticRenditions } from "@/lib/media/videoRenditions";

const Video = ({ medium, objectFit, playerState, playerControls, shouldMount = true, loadEager = false }) => {
  const customObjectFit = objectFit ?? "cover";
  const fit = customObjectFit;
  const nativeVideoRef = useRef(null);
  const useStaticRendition = hasMuxStaticRenditions(medium);
  const isStreamingMuxVideo = Boolean(medium?.playbackId) && !useStaticRendition;
  const src = getVideoSourceUrl(medium);
  const poster = getMuxPosterUrl(medium);

  useEffect(() => {
    if (!shouldMount || isStreamingMuxVideo) return;
    if (!nativeVideoRef.current) return;
    playerControls.playerRef.current = nativeVideoRef.current;
  }, [isStreamingMuxVideo, playerControls.playerRef, shouldMount]);

  useEffect(() => {
    if (!shouldMount || isStreamingMuxVideo) return;
    if (!nativeVideoRef.current) return;

    nativeVideoRef.current.muted = playerControls.muted ?? true;

    if (playerControls.paused) {
      nativeVideoRef.current.pause();
      return;
    }

    const playPromise = nativeVideoRef.current.play();
    if (playPromise?.catch) playPromise.catch(() => {});
  }, [isStreamingMuxVideo, playerControls.muted, playerControls.paused, shouldMount]);

  if (!shouldMount) return null;

  if (isStreamingMuxVideo) {
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
  }

  if (!src) return null;

  return (
    <video
      ref={nativeVideoRef}
      src={src}
      autoPlay
      loop
      muted={playerControls.muted ?? true}
      preload={loadEager ? "auto" : "metadata"}
      poster={poster || undefined}
      playsInline
      controls={false}
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
      onCanPlay={() => playerState.setIsLoaded(true)}
      onPlaying={() => playerState.setIsLoaded(true)}
      onTimeUpdate={playerControls.onTimeUpdate}
      onLoadedMetadata={playerControls.onLoadedMetadata}
    />
  );
};

export default Video;
