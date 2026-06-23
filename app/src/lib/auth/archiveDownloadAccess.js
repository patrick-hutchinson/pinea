const getReleaseTimestamp = (item) => {
  const date = item?.releaseInfo?.releaseDate || item?.releaseDate;
  const timestamp = date ? new Date(date).getTime() : NaN;
  return Number.isNaN(timestamp) ? null : timestamp;
};

export const getMostRecentDownloadableReleaseTimestamp = (items = []) =>
  items.reduce((latest, item) => {
    if (!item?.PDFDownload?.asset?.url) return latest;

    const timestamp = getReleaseTimestamp(item);
    if (timestamp === null) return latest;

    return Math.max(latest, timestamp);
  }, -Infinity);

export const canDownloadArchiveItem = ({ item, membershipSession, mostRecentDownloadableReleaseTimestamp }) => {
  if (!item?.PDFDownload?.asset?.url) return false;
  if (membershipSession?.hasActiveSubscription !== true) return false;
  if (membershipSession?.isMemberPlus === true) return true;

  const releaseTimestamp = getReleaseTimestamp(item);
  if (releaseTimestamp === null) return false;

  if (
    Number.isFinite(mostRecentDownloadableReleaseTimestamp) &&
    releaseTimestamp === mostRecentDownloadableReleaseTimestamp
  ) {
    return true;
  }

  const subscriptionStartDate = membershipSession?.subscriptionStartDate;
  const subscriptionStartTimestamp = subscriptionStartDate ? new Date(subscriptionStartDate).getTime() : NaN;
  if (Number.isNaN(subscriptionStartTimestamp)) return false;

  return releaseTimestamp >= subscriptionStartTimestamp;
};
