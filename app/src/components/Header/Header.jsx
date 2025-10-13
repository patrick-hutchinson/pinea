"use client";

import { useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";

import { StateContext } from "@/context/StateContext";

import DesktopMenu from "./Menu/DesktopMenu";
import MobileMenu from "./Menu/MobileMenu";

import styles from "./Header.module.css";

import Link from "next/link";

const Header = () => {
  const pathname = usePathname();
  const { isMobile } = useContext(StateContext);

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu((prev) => !prev);

  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  const DesktopHeader = () => (
    <header className={`${styles.header}`}>
      <div className={styles.logo}>
        <Link href="/">Photography Intermedia Et Al.</Link>
      </div>
      <div className={`${styles.controls} ff4`}>
        <div className={styles.search}></div>
        <div>En</div>
        <div>De</div>
        <div>Log In</div>
        <div className={styles.menuButton} onClick={() => toggleMenu()} />
      </div>

      {showMenu && <DesktopMenu />}
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
