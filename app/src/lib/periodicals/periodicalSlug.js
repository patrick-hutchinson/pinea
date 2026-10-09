const getLocalizedValue = (value, preferredLanguage = "en") => {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";

  const entry =
    value.find((item) => item?._key === preferredLanguage && typeof item?.value === "string" && item.value.trim()) ||
    value.find((item) => item?._key === "en" && typeof item?.value === "string" && item.value.trim()) ||
    value.find((item) => item?._key === "de" && typeof item?.value === "string" && item.value.trim()) ||
    value.find((item) => typeof item?.value === "string" && item.value.trim());

  return entry?.value || "";
};

export const slugifyPeriodicalValue = (value = "") => {
  const normalized = String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\bp\s*\.?\s*i\s*\.?\s*n\s*\.?\s*e\s*\.?\s*a\b/g, "pinea")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized.replace(/-(\d{1,2})$/, (_, raw) => `-${String(Number(raw)).padStart(3, "0")}`);
};

export const getPeriodicalSlug = (periodical, fallbackIndex = 0) => {
  const source =
    getLocalizedValue(periodical?.selector) ||
    (typeof periodical?.title === "string" ? periodical.title : "") ||
    getLocalizedValue(periodical?.isbn) ||
    periodical?._id ||
    `periodical-${fallbackIndex + 1}`;

  return slugifyPeriodicalValue(source) || `periodical-${fallbackIndex + 1}`;
};

export const getPeriodicalPath = (periodical, fallbackIndex = 0) => `/print-periodical/${getPeriodicalSlug(periodical, fallbackIndex)}`;
