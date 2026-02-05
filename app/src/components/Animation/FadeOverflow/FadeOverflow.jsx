import { useState, useEffect } from "react";
import styles from "./FadeOverflow.module.css";
import { AnimatePresence, motion } from "framer-motion";

const FadeOverflow = ({ children, scrollContainer, backgroundColor }) => {
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  // Handle Fade
  useEffect(() => {
    const el = scrollContainer.current;

    if (!el) return;

    const updateFade = () => {
      setShowTopFade(el.scrollTop > 0);
      setShowBottomFade(el.scrollTop + el.clientHeight < el.scrollHeight);
    };

    updateFade(); // run initially
    el.addEventListener("scroll", updateFade);
    window.addEventListener("resize", updateFade);

    return () => {
      el.removeEventListener("scroll", updateFade);
      window.removeEventListener("resize", updateFade);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {showTopFade && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.fadeTop}
            style={{ background: `linear-gradient(to bottom, ${backgroundColor} 0%, transparent 100%)` }}
          />
        )}
      </AnimatePresence>
      {children}
      <AnimatePresence>
        {showBottomFade && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.fadeBottom}
            style={{ background: `linear-gradient(to top, ${backgroundColor} 0%, transparent 100%)` }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FadeOverflow;
