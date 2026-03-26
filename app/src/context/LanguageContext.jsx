"use client";
import { createContext, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("de");
  const pathname = usePathname();
  const previousLanguageRef = useRef(null);
  const forcedByShopRef = useRef(false);

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

  useEffect(() => {
    const isShopRoute = pathname === "/shop" || pathname?.startsWith("/shop/");

    if (isShopRoute) {
      if (language !== "en") {
        previousLanguageRef.current = language;
        forcedByShopRef.current = true;
        setLanguage("en");
      }
      return;
    }

    if (forcedByShopRef.current) {
      const restoreLanguage = previousLanguageRef.current;
      forcedByShopRef.current = false;
      previousLanguageRef.current = null;

      if (restoreLanguage && restoreLanguage !== language) {
        setLanguage(restoreLanguage);
      }
    }
  }, [pathname, language]);

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
};
