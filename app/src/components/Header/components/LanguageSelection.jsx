import { useContext } from "react";

import { LanguageContext } from "@/context/LanguageContext";

import styles from "../Header.module.css";

const LanguageSelection = ({ setShowMenu }) => {
  const handleClick = (lang) => {
    setLanguage(lang);
    setShowMenu(false);
  };

  const { language, setLanguage } = useContext(LanguageContext);
  return (
    <div style={{ display: "flex", gap: "var(--margin)" }}>
      <button className={language === "de" ? styles.active : ""} onClick={() => handleClick("de")}>
        De
      </button>
      <button className={language === "en" ? styles.active : ""} onClick={() => handleClick("en")}>
        En
      </button>
    </div>
  );
};

export default LanguageSelection;
