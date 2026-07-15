"use client";

import { createContext, useState, useEffect } from "react";

import { usePathname } from "@/context/RouteContext";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState([]);
  const pathname = usePathname();

  // Clear search on route change
  useEffect(() => {
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => {
      setSearchQuery("");
      console.log("hash change");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>{children}</SearchContext.Provider>;
};
