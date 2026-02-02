export function formatDateLabel(date, language) {
  if (!date) return "";

  return date.toLocaleDateString(language === "de" ? "de-DE" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
