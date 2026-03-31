export const LOCALES = ["de", "en"];
export const DEFAULT_LOCALE = "de";

export const getLocaleFromPathname = (pathname = "/") => {
  const [, first] = pathname.split("/");
  return LOCALES.includes(first) ? first : DEFAULT_LOCALE;
};

export const stripLocaleFromPathname = (pathname = "/") => {
  if (!pathname) return "/";
  const segments = pathname.split("/");
  const first = segments[1];
  if (!LOCALES.includes(first)) return pathname;
  const stripped = `/${segments.slice(2).join("/")}`.replace(/\/+/g, "/");
  return stripped === "/" ? "/" : stripped.replace(/\/$/, "") || "/";
};

export const withLocalePathname = (pathname = "/", locale = DEFAULT_LOCALE) => {
  const cleanPath = stripLocaleFromPathname(pathname);
  if (cleanPath === "/") return `/${locale}`;
  return `/${locale}${cleanPath}`;
};
