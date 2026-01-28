import { useState, useEffect, useContext, useRef } from "react";

import { SearchContext } from "@/context/SearchContext";
import { useDebounce } from "./helpers/useDebounce";

import { StateContext } from "@/context/StateContext";

import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import Icon from "@/components/Icon/Icon";

import styles from "./Search.module.css";

const Searchbar = ({ showSearch, setShowSearch }) => {
  const { isMobile } = useContext(StateContext);
  const searchRef = useRef(null);

  const [entry, setEntry] = useState("");
  const { setSearchQuery } = useContext(SearchContext);

  const pathname = usePathname();

  const debouncedQuery = useDebounce(entry, 450);

  useEffect(() => {
    setSearchQuery(debouncedQuery || ""); // send empty string if deleted
  }, [debouncedQuery, setSearchQuery]);

  // Clear search on route change
  useEffect(() => {
    setEntry(""); // reset search
    setShowSearch(false);
  }, [pathname]);

  useEffect(() => {
    if (showSearch) {
      // slight delay to allow AnimatePresence mount
      requestAnimationFrame(() => {
        searchRef.current?.focus();
      });
    }
  }, [showSearch]);

  return (
    <div className={styles.searchbarContainer} style={{ display: "flex", alignItems: "center" }}>
      <motion.div
        className={styles.searchbar}
        initial={{ opacity: 0 }}
        animate={{ opacity: showSearch ? 1 : 0 }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        transition={{ duration: 0.4 }}
        style={{
          pointerEvents: showSearch ? "auto" : "none",
        }}
      >
        <input
          typo={isMobile ? "h3" : "h4"}
          ref={searchRef}
          type="search"
          placeholder="Search"
          value={entry} // <-- use local state
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
          // position: "relative",
          // top: "-2px",
        }}
        onClick={() => setShowSearch((prev) => !prev)}
      >
        <Icon path="/icons/search.svg" />
      </span>
    </div>
  );
};

export default Searchbar;
