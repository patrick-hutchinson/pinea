"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "@/context/RouteContext";

import { SearchContext } from "@/context/SearchContext";
import { StateContext } from "@/context/StateContext";
import { LanguageContext } from "@/context/LanguageContext";

import { useDebounce } from "./helpers/useDebounce";
import Icon from "@/components/Icon/Icon";

import styles from "./Search.module.css";
import { AnimationContext } from "@/context/AnimationContext";

const Searchbar = ({ showSearch, setShowSearch, showSearchbar, showMenu }) => {
  const { language } = useContext(LanguageContext);
  const { isMobile } = useContext(StateContext);
  const { hasEntered } = useContext(AnimationContext);
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
      searchRef.current?.focus({ preventScroll: true });
    } else {
      searchRef.current?.blur();
      setShowSearch(false);
    }
  };

  useEffect(() => {
    if (!showSearch) return;
    const input = searchRef.current;
    if (!input) return;

    const raf = window.requestAnimationFrame(() => {
      input.focus({ preventScroll: true });
      const len = input.value.length;
      input.setSelectionRange(len, len);
    });

    return () => window.cancelAnimationFrame(raf);
  }, [showSearch]);

  return (
    // <AnimatePresence mode={isMobile && "popLayout"}>
    // {showSearchbar && !showMenu && hasEntered && (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        opacity: showSearchbar && !showMenu && hasEntered ? 1 : 0,
        pointerEvents: showSearchbar && !showMenu && hasEntered ? 1 : 0,
        transition: `opacity 0.4s ease ${showSearchbar && !showMenu && hasEntered ? "1s" : "0s"}`,
      }}
      className={styles.searchbarContainer}
    >
      <motion.div
        className={styles.searchbar}
        initial={false}
        animate={{ opacity: showSearch ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        aria-hidden={!showSearch}
        style={{ pointerEvents: showSearch ? "auto" : "none" }}
      >
        <input
          ref={searchRef}
          type="search"
          typo={isMobile ? "h3" : "h4"}
          placeholder={language === "en" ? "Search" : "Suche"}
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          tabIndex={showSearch ? 0 : -1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
        />
      </motion.div>

      <button
        type="button"
        style={{
          height: "14px",
          width: "14px",
          aspectRatio: 1,
          cursor: "pointer",
          display: "inline-block",
          position: "absolute",
          right: 0,
        }}
        onClick={handleSearchClick}
        aria-label={showSearch ? (language === "en" ? "Close search" : "Suche schließen") : language === "en" ? "Open search" : "Suche öffnen"}
      >
        <Icon path="/icons/search.svg" />
      </button>
    </div>
    // )}
    // </AnimatePresence>
  );
};

export default Searchbar;
