import { useContext, useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";

import { LanguageContext } from "@/context/LanguageContext";

import { AnimatePresence, motion } from "framer-motion";

import Icon from "@/components/Icon/Icon";
import Searchbar from "../Search/Searchbar";

const HeaderControls = ({ setShowMenu }) => {
  const [showSearch, setShowSearch] = useState(false);
  const { language, setLanguage } = useContext(LanguageContext);

  const searchRef = useRef(null);

  const handleClick = (lang) => {
    setLanguage(lang);
    setShowMenu(false);
  };

  useEffect(() => {
    if (showSearch) {
      // slight delay to allow AnimatePresence mount
      requestAnimationFrame(() => {
        searchRef.current?.focus();
      });
    }
  }, [showSearch]);

  return (
    <div className={styles.controls}>
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.4 }}
          >
            {/* <Searchbar key="search" ref={searchRef} /> */}
          </motion.div>
        )}
      </AnimatePresence>
      <span
        style={{ height: "14px", width: "14px", aspectRatio: 1, cursor: "pointer" }}
        onClick={() => setShowSearch((prev) => !prev)}
      >
        <Icon path="/icons/search.svg" />
      </span>
      <div style={{ display: "flex", gap: "var(--margin)" }}>
        <button className={language === "de" ? styles.active : ""} onClick={() => handleClick("de")}>
          De
        </button>
        <button className={language === "en" ? styles.active : ""} onClick={() => handleClick("en")}>
          En
        </button>
      </div>
      <div className="not-allowed">
        <button>Log In</button>
      </div>
    </div>
  );
};

export default HeaderControls;
