"use client";

import { useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";

import { StateContext } from "@/context/StateContext";

import DesktopMenu from "./Menu/DesktopMenu";
import MobileMenu from "./Menu/MobileMenu";

import styles from "./Header.module.css";

import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const pathname = usePathname();
  const { isMobile } = useContext(StateContext);

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu((prev) => !prev);

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

  // Close Menu on Navigation
  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  const DesktopHeader = () => (
    <header
      className={`${styles.header}`}
      style={{ background: pathname === "/" ? "transparent" : "var(--background)" }}
    >
      <div className={styles.logo} style={{ position: "relative" }}>
        <Link href="/">
          <AnimatePresence>
            {!scrolling && (
              <motion.div
                key="logo-long"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                transition={{ duration: 1 }}
                style={{ position: "absolute", top: 0, left: 0, whiteSpace: "nowrap" }}
              >
                P.IN.E.A
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>
      <div className={styles.controls} typo="h4">
        <div className={styles.search}></div>
        <div>En</div>
        <div>De</div>
        <div>Log In</div>
        <div className={styles.menuButton} onClick={() => toggleMenu()} style={{ cursor: "pointer" }} />
      </div>

      {showMenu && (
        <AnimatePresence>
          <DesktopMenu />
        </AnimatePresence>
      )}
    </header>
  );

  const MobileHeader = () => (
    <header className={styles.header}>
      <div className={styles.logo}>P.IN.E.A</div>
      <div className={styles.controls}>
        <div>Log In</div>
        <div className={styles.menuButton} />
      </div>

      {showMenu && <MobileMenu />}
    </header>
  );

  return isMobile ? <MobileHeader /> : <DesktopHeader />;
};

export default Header;
