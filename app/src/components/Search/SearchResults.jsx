"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { SearchContext } from "@/context/SearchContext";
import SearchResult from "./SearchResult";
import Label from "@/components/Label/Label";

import { normalizeSearchData } from "./helpers/normalizeSearchData";

import { AnimatePresence, motion } from "framer-motion";
import PineaIcon from "../PineaIcon/PineaIcon";

import styles from "./Search.module.css";
import LenisProvider, { useLenisContext } from "@/context/LenisContext";

const SearchResults = ({ searchableData }) => {
  const lenis = useLenisContext();
  const scrollContainer = useRef(null);

  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const { searchQuery } = useContext(SearchContext);

  const normalizedSearchData = normalizeSearchData(searchableData);

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return normalizedSearchData.filter((p) => p.searchableText.includes(searchQuery.toLowerCase()));
  }, [searchQuery, normalizedSearchData]);

  const GROUP_ORDER = ["interview", "review", "spotOn", "portfolio", "event", "contributor", "openCall", "news"];

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

  // Handle Fade
  useEffect(() => {
    const el = scrollContainer.current;

    if (!el) return;

    const updateFade = () => {
      setShowTopFade(el.scrollTop > 0);
      setShowBottomFade(el.scrollTop + el.clientHeight < el.scrollHeight);
    };

    updateFade(); // run initially
    el.addEventListener("scroll", updateFade);
    window.addEventListener("resize", updateFade);

    return () => {
      el.removeEventListener("scroll", updateFade);
      window.removeEventListener("resize", updateFade);
    };
  }, [searchableData, searchQuery]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [searchQuery]);

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
          {showTopFade && <div className={styles.fade_top} />}

          <div ref={scrollContainer} className={styles.searchResultsInner} data-lenis-prevent>
            {searchResults.length > 0 ? (
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

          {/* {showBottomFade && <div className={styles.fade_bottom} />} */}

          <PineaIcon className={styles.pineaIcon} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchResults;
