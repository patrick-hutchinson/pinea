export const normalizeShopSlug = (value = "") => {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  if (!slug) return "";

  let normalized = slug.replace(/^p-in-e-a-/, "pinea-");
  normalized = normalized.replace(/-(\d{1,2})$/, (_, raw) => `-${String(Number(raw)).padStart(3, "0")}`);

  return normalized;
};

export const toShopProductPath = (handle = "") => `/shop/${normalizeShopSlug(handle)}`;
