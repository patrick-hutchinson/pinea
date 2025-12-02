import { useContext } from "react";
import styles from "./Header.module.css";

import { LanguageContext } from "@/context/LanguageContext";

const HeaderControls = () => {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <div className={styles.controls}>
      {/* <div className={styles.search}></div> */}
      <div style={{ display: "flex", gap: "var(--margin)" }}>
        <button className={language === "de" && styles.active} onClick={() => setLanguage("de")}>
          De
        </button>
        <button className={language === "en" && styles.active} onClick={() => setLanguage("en")}>
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
