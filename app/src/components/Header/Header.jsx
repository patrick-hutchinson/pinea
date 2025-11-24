"use client";

import { useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";

import DesktopMenu from "./Menu/DesktopMenu";
import MobileMenu from "./Menu/MobileMenu";
import Navigation from "./Menu/Navigation";
import MenuButton from "./Menu/MenuButton";

import styles from "./Header.module.css";

import { LanguageContext } from "@/context/LanguageContext";
import { StateContext } from "@/context/StateContext";

import { enableScroll, disableScroll } from "../../helpers/blockScrolling";

import Logo from "./Logo";
import PageTitle from "./PageTitle";

const Header = ({ site }) => {
  const { setLanguage } = useContext(LanguageContext);
  const pathname = usePathname();

  const [showMenu, setShowMenu] = useState(false);

  // Close Menu on Navigation
  useEffect(() => {
    setShowMenu(false);
    enableScroll();
  }, [pathname]);

  useEffect(() => {
    showMenu ? disableScroll() : enableScroll();
  }, [showMenu]);

  const transparentHeaders = ["/"];

  const HeaderControls = () => (
    <div className={styles.controls} typo="h4">
      <div className={styles.search}></div>
      <div style={{ display: "flex", gap: "var(--margin)" }}>
        <button onClick={() => setLanguage("de")}>De</button>
        <button onClick={() => setLanguage("en")}>En</button>
      </div>
      <div className="not-allowed">
        <button>Log In</button>
      </div>
      {/* <MenuButton setShowMenu={setShowMenu} /> */}
    </div>
  );

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
        <div className={styles.controls_wrapper}>
          <HeaderControls />
          <MenuButton setShowMenu={setShowMenu} />
        </div>
      </header>
      {showMenu && <DesktopMenu site={site} />}
      {showMenu && <Navigation onLinkClick={() => setShowMenu(false)} site={site} />}
    </>
  );

  return <DesktopHeader />;
};

export default Header;
