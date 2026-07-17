"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "@/context/RouteContext";

import { DEFAULT_LOCALE, LOCALES, getLocaleFromPathname, stripLocaleFromPathname, withLocalePathname } from "@/lib/i18n";

export const LanguageContext = createContext({
  language: DEFAULT_LOCALE,
  setLanguage: () => {},
});

const PRESERVE_SCROLL_KEY = "pinea_preserve_scroll_once";
const LANGUAGE_TRANSITION_KEY = "pinea_language_transition_pending";
const LANGUAGE_TRANSITION_DURATION = 450;

export const LanguageProvider = ({ children }) => {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const searchParams = useSearchParams();
  const transitionTimeoutRef = useRef(null);

  const routeLanguage = useMemo(() => getLocaleFromPathname(pathname), [pathname]);
  const [displayLanguage, setDisplayLanguage] = useState(routeLanguage);
  const basePathname = useMemo(() => stripLocaleFromPathname(pathname), [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage.getItem(LANGUAGE_TRANSITION_KEY) === "1") return;
    setDisplayLanguage(routeLanguage);
  }, [routeLanguage]);

  useEffect(() => {
    const completeLanguageTransition = () => {
      window.sessionStorage.removeItem(LANGUAGE_TRANSITION_KEY);
      setDisplayLanguage(getLocaleFromPathname(window.location.pathname));
    };

    window.addEventListener("pinea-page-exit-complete", completeLanguageTransition);

    return () => {
      window.removeEventListener("pinea-page-exit-complete", completeLanguageTransition);
      if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  const setLanguage = useCallback(
    (nextLanguage) => {
      if (!LOCALES.includes(nextLanguage)) return;
      if (nextLanguage === displayLanguage) return;

      const nextPath = withLocalePathname(basePathname, nextLanguage);
      const query = searchParams?.toString();
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const nextUrl = `${nextPath}${query ? `?${query}` : ""}${hash}`;

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          PRESERVE_SCROLL_KEY,
          JSON.stringify({
            top: window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0,
          }),
        );
        window.sessionStorage.setItem(LANGUAGE_TRANSITION_KEY, "1");
        document.documentElement.classList.add("preserve-home-backdrop-blur");
        window.dispatchEvent(new Event("pinea-language-transition-start"));
        window.dispatchEvent(new Event("pinea-page-transition-start"));
      }

      if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = window.setTimeout(() => {
        router.push(nextUrl, { scroll: false });
      }, LANGUAGE_TRANSITION_DURATION);
    },
    [basePathname, displayLanguage, router, searchParams],
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
      language: displayLanguage,
      setLanguage,
    }),
    [displayLanguage, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
