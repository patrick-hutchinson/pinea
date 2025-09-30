"use client";

import { useState } from "react";

import DesktopMenu from "./Menu/DesktopMenu";

import styles from "./Header.module.css";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  return (
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
};

export default Header;
