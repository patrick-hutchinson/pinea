"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import Menu from "./Menu/Menu";

import Navigation from "./Menu/Navigation";
import MenuButton from "./Menu/MenuButton";
import HeaderControls from "./HeaderControls";

import styles from "./Header.module.css";

import { enableScroll, disableScroll } from "../../helpers/blockScrolling";

import Logo from "./Logo";
import PageTitle from "./PageTitle";

const Header = ({ site }) => {
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

  return (
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
          <HeaderControls typo="h4" />
          <MenuButton setShowMenu={setShowMenu} />
        </div>
      </header>
      {showMenu && <Menu site={site} />}
      {showMenu && <Navigation onLinkClick={() => setShowMenu(false)} site={site} />}
    </>
  );
};

export default Header;
