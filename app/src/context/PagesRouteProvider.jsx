"use client";

import { useMemo } from "react";
import { useRouter as usePagesRouter } from "next/router";

import { RouteContextProvider } from "./RouteContext";

const getPathname = (asPath = "/") => asPath.split("?")[0].split("#")[0] || "/";

const getSearchParams = (asPath = "/") => {
  const query = asPath.split("?")[1]?.split("#")[0] || "";
  return new URLSearchParams(query);
};

const PagesRouteProvider = ({ children }) => {
  const router = usePagesRouter();
  const routeValue = useMemo(
    () => ({
      pathname: getPathname(router.asPath),
      searchParams: getSearchParams(router.asPath),
      push: (url, options = {}) => router.push(url, undefined, { scroll: false, ...options }),
      replace: (url, options = {}) => router.replace(url, undefined, { scroll: false, ...options }),
      back: router.back,
    }),
    [router],
  );

  return <RouteContextProvider value={routeValue}>{children}</RouteContextProvider>;
};

export default PagesRouteProvider;
