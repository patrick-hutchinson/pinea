import { useContext } from "react";
import styles from "./Header.module.css";

import { LanguageContext } from "@/context/LanguageContext";

const HeaderControls = () => {
  const { setLanguage } = useContext(LanguageContext);

  return (
    <div className={styles.controls}>
      {/* <div className={styles.search}></div> */}
      <div style={{ display: "flex", gap: "var(--margin)" }}>
        <button onClick={() => setLanguage("de")}>De</button>
        <button onClick={() => setLanguage("en")}>En</button>
      </div>
      <div className="not-allowed">
        <button>Log In</button>
      </div>
    </div>
  );
};

export default HeaderControls;
