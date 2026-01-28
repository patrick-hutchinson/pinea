"use client";

import { createContext, useState, useEffect } from "react";

import { usePathname } from "next/navigation";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState([]);
  const pathname = usePathname();

  // Clear search on route change
  useEffect(() => {
    setSearchQuery(""); // reset search
  }, [pathname]);

  return <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>{children}</SearchContext.Provider>;
};
