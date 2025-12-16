"use client";
import { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("de");

  // Load preferred language on mount
  useEffect(() => {
    const stored = localStorage.getItem("language");
    if (stored) {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    // 1. Check hash first
    const hash = window.location.hash;

    if (hash === "#de" || hash === "#en") {
      const langFromHash = hash.replace("#", "");
      setLanguage(langFromHash);
      localStorage.setItem("language", langFromHash);
      return;
    }

    // 2. Fallback to localStorage
    const stored = localStorage.getItem("language");
    if (stored === "de" || stored === "en") {
      setLanguage(stored);
    }
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
};
