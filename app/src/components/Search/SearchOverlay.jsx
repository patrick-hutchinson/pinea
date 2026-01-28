"use client";

import { useContext, useEffect, useMemo } from "react";
import { SearchContext } from "@/context/SearchContext";
import SearchResult from "./SearchResult";

import { normalizeSearchData } from "./helpers/normalizeSearchData";

import { AnimatePresence, motion } from "framer-motion";

const SearchOverlay = ({ searchableData }) => {
  const { searchQuery } = useContext(SearchContext);

  const normalizedSearchData = normalizeSearchData(searchableData);

  console.log(normalizedSearchData, "normalized search data");

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return normalizedSearchData.filter((p) => p.searchableText.includes(searchQuery.toLowerCase()));
  }, [searchQuery, normalizedSearchData]);

  if (searchQuery.length <= 1) return;

  return (
    <AnimatePresence>
      {searchQuery &&
        (searchResults.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.4 }}
            style={{
              position: "fixed",
              top: "0px",
              width: "100vw",
              height: "100vh",
              zIndex: 20,
              background: "var(--background)",
              color: "var(--foreground)",
              padding: "var(--margin)",
              paddingTop: "80px",
            }}
          >
            {searchResults.map((result) => (
              <SearchResult key={result.id} searchResult={result} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.4 }}
            style={{
              position: "fixed",
              top: "0px",
              width: "100vw",
              height: "100vh",
              zIndex: 20,
              background: "var(--background)",
              color: "var(--foreground)",
              padding: "var(--margin)",
              paddingTop: "80px",
            }}
          >
            <h2>No results found.</h2>
          </motion.div>
        ))}
    </AnimatePresence>
  );
};

export default SearchOverlay;
