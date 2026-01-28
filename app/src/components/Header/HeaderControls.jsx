import { useContext, useState, useEffect, useRef } from "react";

import styles from "./Header.module.css";

import { LanguageContext } from "@/context/LanguageContext";

import Searchbar from "../Search/Searchbar";
import { StateContext } from "@/context/StateContext";

const HeaderControls = ({ setShowMenu, showSearch, setShowSearch }) => {
  const { isMobile } = useContext(StateContext);
  const { language, setLanguage } = useContext(LanguageContext);

  const handleClick = (lang) => {
    setLanguage(lang);
    setShowMenu(false);
  };

  return (
    <div className={styles.controls}>
      <Searchbar showSearch={showSearch} setShowSearch={setShowSearch} />

      <>
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
      </>
    </div>
  );
};

export default HeaderControls;
