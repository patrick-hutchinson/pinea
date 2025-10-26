"use client";

import { useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";

import DesktopMenu from "./Menu/DesktopMenu";
import MobileMenu from "./Menu/MobileMenu";

import styles from "./Header.module.css";

import { AnimatePresence } from "framer-motion";
import { StateContext } from "@/context/StateContext";

import Link from "next/link";

import Logo from "./Logo";
import PageTitle from "./PageTitle";

const Header = () => {
  const { language, setLanguage } = useContext(StateContext);
  const pathname = usePathname();

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu((prev) => !prev);

  // Close Menu on Navigation
  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  const MenuButton = () => (
    <div className={styles.menuButton_wrapper}>
      <div className={styles.menuButton} onClick={() => toggleMenu()} />
    </div>
  );

  const DesktopHeader = () => (
    <header
      className={`${styles.header}`}
      style={{ background: pathname === "/" ? "transparent" : "var(--background)" }}
    >
      <Logo />

      <PageTitle />

      <div className={styles.controls} typo="h4">
        <div className={styles.search}></div>
        <div style={{ display: "flex", gap: "var(--margin)" }}>
          <button onClick={() => setLanguage("en")}>En</button>
          <button onClick={() => setLanguage("de")}>De</button>
        </div>
        <div>Log In</div>
        <MenuButton />
      </div>

      {showMenu && <DesktopMenu />}
    </header>
  );

  return <DesktopHeader />;
};

export default Header;
