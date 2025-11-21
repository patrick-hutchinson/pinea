"use client";

import { useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";

import DesktopMenu from "./Menu/DesktopMenu";
import MobileMenu from "./Menu/MobileMenu";
import Navigation from "./Menu/Navigation";

import styles from "./Header.module.css";

import { LanguageContext } from "@/context/LanguageContext";

import Logo from "./Logo";
import PageTitle from "./PageTitle";

const Header = ({ site }) => {
  const { language, setLanguage } = useContext(LanguageContext);
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

  const transparentHeaders = ["/"];

  const DesktopHeader = () => (
    <>
      <header
        className={`${styles.header} ${showMenu && styles.open}`}
        style={{
          background: transparentHeaders.includes(pathname) ? "transparent" : "#fff",
        }}
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
      </header>
      {showMenu && <DesktopMenu site={site} />}
      {showMenu && <Navigation site={site} />}
    </>
  );

  return <DesktopHeader />;
};

export default Header;
