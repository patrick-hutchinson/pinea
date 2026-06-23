"use client";

import { useLanguage } from "@/context/LanguageContext";

const FormatDate = ({ date, className, format }) => {
  const { language } = useLanguage();
  if (!date) return null;

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return null;

  const locale = language === "en" ? "en-GB" : "de-DE";
  const formatted = parsedDate
    .toLocaleDateString(locale, format)
    .replace(/([A-Za-zÄÖÜäöüß]{3,})(?!\.)\b/g, "$1.");

  return (
    <time
      style={{
        fontVariantNumeric: "tabular-nums",
        fontFeatureSettings: '"tnum" 1',
      }}
      className={className}
    >
      {formatted}
    </time>
  );
};

export default FormatDate;
