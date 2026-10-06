"use client";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

const hasTranslationValue = (item) => {
  const value = item?.value;

  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;

  return value != null;
};

export function translate(object, languageSetting) {
  const { language } = useContext(LanguageContext);

  const useLanguage = languageSetting ? languageSetting : language;

  if (typeof object === "string") return object;

  if (!object || !Array.isArray(object)) return "";

  const translations = object.filter(hasTranslationValue);

  // Try current language first
  const translation =
    translations.find((item) => item._key === useLanguage) ||
    translations.find((item) => item._key === "en") || // fallback to English
    translations.find((item) => item._key === "de"); // fallback to German

  return translation?.value || "";
}
