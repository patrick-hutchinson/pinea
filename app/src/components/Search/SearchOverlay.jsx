"use client";

import { useContext, useEffect, useMemo } from "react";
import { SearchContext } from "@/context/SearchContext";
import SearchResult from "./SearchResult";
import Label from "@/components/Label/Label";

import { normalizeSearchData } from "./helpers/normalizeSearchData";

import { AnimatePresence, motion } from "framer-motion";
import PineaIcon from "../PineaIcon/PineaIcon";
import BlurContainer from "../BlurContainer/BlurContainer";

import styles from "./Search.module.css";

const SearchOverlay = ({ searchableData }) => {
  const { searchQuery } = useContext(SearchContext);

  const normalizedSearchData = normalizeSearchData(searchableData);

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return normalizedSearchData.filter((p) => p.searchableText.includes(searchQuery.toLowerCase()));
  }, [searchQuery, normalizedSearchData]);

  const GROUP_ORDER = ["interview", "review", "spotOn", "portfolio", "contributor", "openCall", "news"];

  const groupedResults = useMemo(() => {
    return searchResults.reduce((acc, item) => {
      const key = item.group;

      if (!acc[key]) {
        acc[key] = {
          label: item.label,
          items: [],
        };
      }

      acc[key].items.push(item);
      return acc;
    }, {});
  }, [searchResults]);

  const orderedGroupedResults = useMemo(() => {
    return GROUP_ORDER.filter((key) => groupedResults[key]) // only categories that exist
      .map((key) => ({
        key,
        ...groupedResults[key],
      }));
  }, [groupedResults]);

  if (searchQuery.length <= 1) return null;

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
              zIndex: 51,
              background: "var(--background)",
              color: "var(--foreground)",
              padding: "var(--margin)",
            }}
          >
            <div style={{ position: "relative", overflowY: "scroll", top: "80px", height: "calc(100vh - 110px)" }}>
              {Object.entries(orderedGroupedResults).map(([key, categoryResults]) => (
                <div key={key} style={{ marginBottom: "36px" }}>
                  <div style={{ display: "inline-block", marginBottom: "var(--margin-small)" }}>
                    <Label>{categoryResults?.label}</Label>
                  </div>

                  {categoryResults.items.map((result) => (
                    <SearchResult key={result.id} searchResult={result} />
                  ))}
                </div>
              ))}
            </div>
            <PineaIcon className={styles.pineaIcon} />
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
              zIndex: 51,
              background: "var(--background)",
              color: "var(--foreground)",
              padding: "var(--margin)",
              paddingTop: "80px",
            }}
          >
            <h2>No results found</h2>
          </motion.div>
        ))}
    </AnimatePresence>
  );
};

export default SearchOverlay;
