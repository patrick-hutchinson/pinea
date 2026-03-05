import { convertToPlainText } from "@/helpers/convertToPlainText";
import { translate } from "@/helpers/translate";

const flattenI18nValues = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";

  return value
    .map((entry) => {
      if (typeof entry === "string") return entry;
      return typeof entry?.value === "string" ? entry.value : "";
    })
    .filter(Boolean)
    .join(" ");
};

const flattenStringArray = (value) => {
  if (!Array.isArray(value)) return "";

  return value
    .map((entry) => (typeof entry === "string" ? entry : ""))
    .filter(Boolean)
    .join(" ");
};

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
      case "visit":
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
      case "event":
        meta = { route: "/calendar#", type: "calendar" };
        break;
      default:
        break;
    }

    const museumText = [convertToPlainText(translate(item.museum)), flattenI18nValues(item.museum)]
      .filter(Boolean)
      .join(" ");
    const authorText = [
      flattenStringArray(item.contributorNames),
      flattenStringArray(item.legacyAuthorNames),
      item.author?.name,
      item.author,
    ]
      .filter(Boolean)
      .join(" ");

    return {
      id: item._id,
      group: item._type,
      label: meta.type, // 👈 human-readable
      route: meta.route,
      teaser: item.teaser,
      name: item.name,
      title: convertToPlainText(translate(item.title)) || convertToPlainText(translate(item.name)) || "",
      author: authorText || "",
      museum: museumText || "",
      slug: item._type === "contributor" ? "" : item.slug || item._id,
      searchableText: [
        convertToPlainText(translate(item.title)),
        convertToPlainText(translate(item.teaser)),
        convertToPlainText(translate(item.name)),
        museumText,
        authorText,
        meta.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    };
  });
}
