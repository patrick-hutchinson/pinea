import { convertToPlainText } from "@/helpers/convertToPlainText";
import { translate } from "@/helpers/translate";

export function normalizeSearchData(searchableData = []) {
  return searchableData.map((item) => {
    let meta = { type: item._type, category: "", route: "" };

    switch (item._type) {
      case "portfolio":
        meta = { route: "/stories/portfolios/", type: "portfolios" };
        break;
      case "news":
        meta = { route: "/news#", type: "news" };
        break;
      case "openCall":
        meta = { route: "/open-calls#", type: "open calls" };
        break;
      case "interview":
        meta = { route: "/stories/visits/", type: "visits" };
        break;
      case "review":
        meta = { route: "/stories/reviews/", type: "reviews" };
        break;
      case "spotOn":
        meta = { route: "/spot-on/", type: "spot on" };
        break;
      case "contributor":
        meta = { route: "/contributors/", type: "contributor" };
        break;
      default:
        break;
    }

    return {
      id: item._id,
      ...meta,
      teaser: item.teaser,
      name: item.name,
      title: convertToPlainText(translate(item.title)) || convertToPlainText(translate(item.name)) || "",
      author: item.author?.name || item.author || "",
      slug: item.slug,
      searchableText: [
        convertToPlainText(translate(item.title)),
        convertToPlainText(translate(item.name)),
        item.author?.name,
        item.author,
        meta.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    };
  });
}
