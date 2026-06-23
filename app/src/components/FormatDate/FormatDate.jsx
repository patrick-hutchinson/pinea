"use client";

import { useLanguage } from "@/context/LanguageContext";

const FormatDate = ({ date, className, format }) => {
  const { language } = useLanguage();
  if (!date) return null;

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return null;

  const locale = language === "en" ? "en-GB" : "de-DE";
  const resolvedFormat = format || {};
  const formatted = parsedDate.toLocaleDateString(locale, resolvedFormat);
  const shouldAddMonthDot = resolvedFormat.month === "short";
  const longMonth = parsedDate.toLocaleDateString(locale, { month: "long" });
  const shortMonth = parsedDate.toLocaleDateString(locale, { month: "short" }).replace(/\.$/, "");
  const monthWasAbbreviated = shortMonth.toLowerCase() !== longMonth.toLowerCase();
  const displayDate =
    shouldAddMonthDot && monthWasAbbreviated
      ? formatted.replace(new RegExp(`\\b${shortMonth.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b(?!\\.)`), `${shortMonth}.`)
      : formatted;

  return (
    <time
      style={{
        fontVariantNumeric: "tabular-nums",
        fontFeatureSettings: '"tnum" 1',
      }}
      className={className}
    >
      {displayDate}
    </time>
  );
};

export default FormatDate;
