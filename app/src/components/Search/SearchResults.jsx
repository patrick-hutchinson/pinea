"use client";

import { useContext, useEffect, useMemo } from "react";
import { SearchContext } from "@/context/SearchContext";
import SearchResult from "./SearchResult";
import Label from "@/components/Label/Label";

import { normalizeSearchData } from "./helpers/normalizeSearchData";

import { AnimatePresence, motion } from "framer-motion";
import PineaIcon from "../PineaIcon/PineaIcon";

import styles from "./Search.module.css";

const SearchResults = ({ searchableData }) => {
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

  return (
    <AnimatePresence>
      {searchQuery.length > 1 && (
        <motion.div
          key="results"
          className={styles.searchResultsOuter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.searchResultsInner}>
            {searchResults.length > 1 ? (
              Object.entries(orderedGroupedResults).map(([key, categoryResults]) => (
                <div key={key} className={styles.searchResultGroup}>
                  <Label className={styles.label}>{categoryResults?.label}</Label>

                  {categoryResults.items.map((result) => (
                    <SearchResult key={result.id} searchResult={result} />
                  ))}
                </div>
              ))
            ) : (
              <div>No results found</div>
            )}
          </div>
          <PineaIcon className={styles.pineaIcon} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchResults;
