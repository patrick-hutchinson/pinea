"use client";

import { useState, useContext } from "react";

import { StateContext } from "@/context/StateContext";

import DesktopMenu from "./Menu/DesktopMenu";
import MobileMenu from "./Menu/MobileMenu";

import styles from "./Header.module.css";

const Header = () => {
  const { isMobile } = useContext(StateContext);

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu((prev) => !prev);

  const DesktopHeader = () => (
    <header className={styles.header}>
      <div className={styles.logo}>Photography Intermedia Et Al.</div>
      <div className={styles.controls}>
        <div className={styles.search}></div>
        <div>En</div>
        <div>De</div>
        <div>Subscribe</div>
        <div className={styles.menuButton} onClick={() => toggleMenu()} />
      </div>

      {showMenu && <DesktopMenu />}
    </header>
  );

  const MobileHeader = () => (
    <header className={styles.header}>
      <div className={styles.logo}>P.IN.E.A</div>
      <div className={styles.controls}>
        <div>Subscribe</div>
        <div className={styles.menuButton} />
      </div>

      {showMenu && <MobileMenu />}
    </header>
  );

  return isMobile ? <MobileHeader /> : <DesktopHeader />;
};

export default Header;
