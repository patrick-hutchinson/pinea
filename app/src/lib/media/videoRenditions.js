const DEFAULT_RENDITION = "highest.mp4";

export const hasMuxStaticRenditions = (medium) => {
  const renditions = medium?.staticRenditions;
  if (!medium?.playbackId) return false;
  if (medium?.staticRendition) return true;
  if (!renditions) return false;
  if (renditions.status && renditions.status !== "ready") return false;
  return true;
};

export const getMuxVideoRenditionUrl = (medium, rendition = DEFAULT_RENDITION) => {
  if (!hasMuxStaticRenditions(medium)) return null;

  const selectedRendition = medium.staticRendition || rendition;
  const renditionName =
    selectedRendition.endsWith(".mp4") || selectedRendition.endsWith(".m4a")
      ? selectedRendition
      : `${selectedRendition}.mp4`;

  return `https://stream.mux.com/${medium.playbackId}/${renditionName}`;
};

export const getVideoSourceUrl = (medium, rendition) => getMuxVideoRenditionUrl(medium, rendition) || medium?.url || null;

export const getMuxPosterUrl = (medium, width = 1200) =>
  medium?.playbackId ? `https://image.mux.com/${medium.playbackId}/thumbnail.jpg?width=${width}` : null;
