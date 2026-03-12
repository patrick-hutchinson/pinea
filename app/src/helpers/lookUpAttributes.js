export const lookUpAttributes = (item) => {
  const fallbackMedium = item?.preview?.medium || item?.cover?.medium || item?.portrait?.medium;

  switch (
    item?.category // use category — not type, based on your data
  ) {
    case "reviews":
      return {
        title: item?.title,
        text: undefined,
        medium: item?.preview?.medium || item?.cover?.medium || fallbackMedium,
      };
    case "spot-on":
      return {
        title: item?.title,
        text: undefined,
        medium: item?.preview?.medium || item?.cover?.medium || fallbackMedium,
      };
    case "visits":
      return {
        title: item?.title,
        text: item?.teaser,
        ...(item?.preview?.medium ? { medium: item.preview.medium } : { media: item?.gallery || [] }),
      };
    case "portfolios":
      return {
        title: item?.name,
        text: item?.teaser,
        medium: item?.satelliteImage?.medium || fallbackMedium,
        ...(Array.isArray(item?.gallery) && item.gallery.length > 0 ? { media: item.gallery } : {}),
      };
    case "recommended":
      return {
        title: item?.name,
        text: undefined,
        medium: item?.portrait?.medium || fallbackMedium,
      };
    default:
      return {
        title: item?.title || item?.name,
        text: item?.teaser,
        ...(fallbackMedium ? { medium: fallbackMedium } : {}),
        ...(Array.isArray(item?.gallery) ? { media: item.gallery } : {}),
      };
  }
};
