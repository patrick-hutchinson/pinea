import { convertToPlainText } from "@/helpers/convertToPlainText";
import { translate } from "@/helpers/translate";
import { normalizeShopSlug } from "@/lib/shopifySlug";
import { getPeriodicalSlug } from "@/lib/periodicals/periodicalSlug";

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

const flattenI18nPlainText = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";

  const looksLikePortableText = value.some((entry) => entry?._type === "block");
  if (looksLikePortableText) return convertToPlainText(value);

  return value
    .map((entry) => {
      if (typeof entry === "string") return entry;
      return convertToPlainText(entry?.value);
    })
    .filter(Boolean)
    .join(" ");
};

const flattenStringArray = (value) => {
  if (!Array.isArray(value)) return "";

  return value
    .map((entry) => {
      if (typeof entry === "string") return entry;
      if (entry && typeof entry === "object" && typeof entry.name === "string") return entry.name;
      return "";
    })
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
      case "person":
        meta = { route: "/stories/recommended/", type: "recommended" };
        break;
      case "periodical":
        meta = { route: "/print-periodical/", type: "print periodical" };
        break;
      case "shopProduct":
        meta = { route: "/shop/", type: "shop" };
        break;
      default:
        break;
    }

    const museumText = [convertToPlainText(translate(item.museum)), flattenI18nValues(item.museum)]
      .filter(Boolean)
      .join(" ");
    const authorText = [
      flattenStringArray(item.artistNames),
      flattenStringArray(item.contributorNames),
      flattenStringArray(item.legacyAuthorNames),
      flattenStringArray(item.author),
      item.author?.name,
      item.author,
    ]
      .filter(Boolean)
      .join(" ");
    const periodicalInfoText = Array.isArray(item.info)
      ? item.info
          .flatMap((infoItem) => [flattenI18nPlainText(infoItem?.title), flattenI18nPlainText(infoItem?.text)])
          .filter(Boolean)
          .join(" ")
      : "";
    const periodicalSelector = convertToPlainText(translate(item.selector)) || flattenI18nValues(item.selector);

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
      slug:
        item._type === "contributor"
          ? ""
          : item._type === "periodical"
            ? getPeriodicalSlug(item)
          : item._type === "shopProduct"
            ? normalizeShopSlug(item.handle || item.slug || "")
            : item.slug || item._id,
      searchableText: [
        convertToPlainText(translate(item.title)),
        convertToPlainText(translate(item.teaser)),
        convertToPlainText(translate(item.description)),
        convertToPlainText(translate(item.name)),
        item.isbn,
        periodicalSelector,
        periodicalInfoText,
        item.category,
        item.releaseStatus,
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
