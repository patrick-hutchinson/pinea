"use client";
import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "@/context/RouteContext";

import { DEFAULT_LOCALE, LOCALES, getLocaleFromPathname, stripLocaleFromPathname, withLocalePathname } from "@/lib/i18n";

export const LanguageContext = createContext({
  language: DEFAULT_LOCALE,
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }) => {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const searchParams = useSearchParams();

  const language = useMemo(() => getLocaleFromPathname(pathname), [pathname]);
  const basePathname = useMemo(() => stripLocaleFromPathname(pathname), [pathname]);

  const setLanguage = useCallback(
    (nextLanguage) => {
      if (!LOCALES.includes(nextLanguage)) return;

      const nextPath = withLocalePathname(basePathname, nextLanguage);
      const query = searchParams?.toString();
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const nextUrl = `${nextPath}${query ? `?${query}` : ""}${hash}`;

      router.push(nextUrl);
    },
    [basePathname, router, searchParams],
  );

  // Backward compatibility for old hash-based language links (e.g. /about#en).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (hash !== "#de" && hash !== "#en") return;

    const hashLocale = hash.slice(1);
    if (!LOCALES.includes(hashLocale)) return;

    const query = searchParams?.toString();
    const nextPath = withLocalePathname(basePathname, hashLocale);
    const nextUrl = `${nextPath}${query ? `?${query}` : ""}`;

    router.replace(nextUrl);
  }, [basePathname, router, searchParams]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
    }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
