import { useContext } from "react";
import styles from "./Header.module.css";

import { LanguageContext } from "@/context/LanguageContext";

const HeaderControls = ({ setShowMenu }) => {
  const { language, setLanguage } = useContext(LanguageContext);

  const handleClick = (lang) => {
    setLanguage(lang);
    setShowMenu(false);
  };

  return (
    <div className={styles.controls}>
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
