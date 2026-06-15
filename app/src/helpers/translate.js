"use client";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

export function translate(object, languageSetting) {
  const { language } = useContext(LanguageContext);

  const useLanguage = languageSetting ? languageSetting : language;

  if (typeof object === "string") return object;

  if (!object || !Array.isArray(object)) return "";

  const translations = object.filter(Boolean);

  // Try current language first
  const translation =
    translations.find((item) => item._key === useLanguage) ||
    translations.find((item) => item._key === "en") || // fallback to English
    translations.find((item) => item._key === "de"); // fallback to German

  return translation?.value || "";
}
