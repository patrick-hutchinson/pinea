import { useContext } from "react";

import { LanguageContext } from "@/context/LanguageContext";

import styles from "../Header.module.css";
import { AnimatePresence, motion } from "framer-motion";

const LanguageSelection = ({ setShowMenu, showMenu, isMobile }) => {
  const handleClick = (event, lang) => {
    event.preventDefault();
    event.stopPropagation();

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setLanguage(lang);
    setShowMenu(false);
  };

  const { language, setLanguage } = useContext(LanguageContext);
  return (
    <AnimatePresence mode="popLayout">
      {(!isMobile || (isMobile && showMenu)) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 1 } }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0 } }}
          transition={{ duration: 0.5, delay: 1 }}
          style={{ display: "flex", gap: "var(--margin)" }}
        >
          <button type="button" className={language === "de" ? styles.active : ""} onClick={(e) => handleClick(e, "de")}>
            De
          </button>
          <button type="button" className={language === "en" ? styles.active : ""} onClick={(e) => handleClick(e, "en")}>
            En
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LanguageSelection;
