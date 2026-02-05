"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { SearchContext } from "@/context/SearchContext";
import { StateContext } from "@/context/StateContext";
import { LanguageContext } from "@/context/LanguageContext";

import { useDebounce } from "./helpers/useDebounce";
import Icon from "@/components/Icon/Icon";

import styles from "./Search.module.css";

const Searchbar = ({ showSearch, setShowSearch, showSearchbar }) => {
  const { language } = useContext(LanguageContext);
  const { isMobile } = useContext(StateContext);
  const { setSearchQuery } = useContext(SearchContext);

  const searchRef = useRef(null);
  const [entry, setEntry] = useState("");

  const pathname = usePathname();
  const debouncedQuery = useDebounce(entry, 450);

  useEffect(() => {
    setSearchQuery(debouncedQuery || "");
  }, [debouncedQuery, setSearchQuery]);

  // Clear search on route change
  useEffect(() => {
    setEntry("");
    setShowSearch(false);
  }, [pathname, setShowSearch]);

  const handleSearchClick = () => {
    if (!showSearch) {
      setShowSearch(true);

      // 🔑 Must be synchronous & gesture-bound (iOS rule)
      searchRef.current?.focus();
    } else {
      setShowSearch(false);
    }
  };

  return (
    <div className={styles.searchbarContainer} style={{ display: "flex", alignItems: "center" }}>
      {/* AnimatePresence handles mounting/unmounting of the search input */}
      <AnimatePresence>
        {showSearchbar && (
          <div initial={{ opacity: 0 }}>
            <motion.div
              className={styles.searchbar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              aria-hidden={!showSearch}
              key="searchbar" // key ensures AnimatePresence can track it
            >
              <input
                ref={searchRef}
                type="search"
                typo={isMobile ? "h3" : "h4"}
                placeholder={language === "en" ? "Search" : "Suche"}
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
              />
            </motion.div>

            <span
              style={{
                height: "14px",
                width: "14px",
                aspectRatio: 1,
                cursor: "pointer",
                display: "inline-block",
              }}
              onClick={handleSearchClick}
            >
              <Icon path="/icons/search.svg" />
            </span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Searchbar;
