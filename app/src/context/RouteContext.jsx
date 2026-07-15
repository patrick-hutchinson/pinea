"use client";

import { createContext, useContext } from "react";

const RouteContext = createContext({
  pathname: "/",
  searchParams: new URLSearchParams(),
  push: () => {},
  replace: () => {},
  back: () => {},
});

export const RouteContextProvider = ({ value, children }) => (
  <RouteContext.Provider value={value}>{children}</RouteContext.Provider>
);

export const usePathname = () => useContext(RouteContext).pathname;

export const useSearchParams = () => useContext(RouteContext).searchParams;

export const useRouter = () => {
  const route = useContext(RouteContext);

  return {
    push: route.push,
    replace: route.replace,
    back: route.back,
  };
};
