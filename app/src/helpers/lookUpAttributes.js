export const lookUpAttributes = (item) => {
  switch (
    item.category // use category — not type, based on your data
  ) {
    case "reviews":
      return {
        title: item.title,
        text: undefined,
        medium: item.cover?.medium,
      };
    case "spot-on":
      return {
        title: item.title,
        text: undefined,
        medium: item.cover?.medium,
      };
    case "visits":
      return {
        title: item.title,
        text: item.teaser,
        media: item.gallery,
      };
    case "portfolios":
      return {
        title: item.name,
        text: item.teaser,
        medium: item.satelliteImage.medium,
      };
    case "people":
      return {
        title: item.name,
        text: undefined,
        medium: item.portrait?.medium,
      };
  }
};
