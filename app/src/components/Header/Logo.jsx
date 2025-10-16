import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import Link from "next/link";

import styles from "./Header.module.css";

const Logo = () => {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      console.log("scrolling");
      // When scrolling starts → set to short form
      setScrolling(true);

      // Clear existing timeout
      clearTimeout(scrollTimeout);

      // After user stops scrolling for 300ms → reset
      scrollTimeout = setTimeout(() => {
        setScrolling(false);
      }, 300);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className={styles.logo} style={{ position: "relative" }}>
      <Link href="/">
        <AnimatePresence mode="popLayout">
          {!scrolling && (
            <motion.div
              key="logo-long"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ position: "absolute", top: 0, left: 0, whiteSpace: "nowrap" }}
            >
              Photography Intermedia Et Al.
            </motion.div>
          )}
          {scrolling && (
            <motion.div
              key="logo-short"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ position: "absolute", top: 0, left: 0, whiteSpace: "nowrap" }}
            >
              P.IN.E.A
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </div>
  );
};

export default Logo;
