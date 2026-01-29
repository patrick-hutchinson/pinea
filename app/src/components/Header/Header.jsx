"use client";

import { useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import { StateContext } from "@/context/StateContext";
import { MenuContext } from "@/context/MenuContext";

import { enableScroll, disableScroll } from "@/helpers/blockScrolling";

import Searchbar from "../Search/Searchbar";
import Logo from "./components/Logo";
import PageTitle from "./components/PageTitle";
import MenuButton from "./components/MenuButton";
import LanguageSelection from "./components/LanguageSelection";
import LoginButton from "./components/LoginButton";

import styles from "./Header.module.css";

const Header = () => {
  const { isMobile } = useContext(StateContext);
  const pathname = usePathname();

  const isHome = pathname === "/";

  const [showSearch, setShowSearch] = useState(false);

  const { showMenu, setShowMenu } = useContext(MenuContext);

  // Close Menu on Navigation
  useEffect(() => {
    setShowMenu(false);
    enableScroll();
  }, [pathname]);

  useEffect(() => {
    showMenu ? disableScroll() : enableScroll();
  }, [showMenu]);

  const showSearchbar = !(isMobile && showMenu);

  return (
    <header
      className={`${styles.header} ${showMenu && styles.menuIsVisible}`}
      style={{
        background: isHome || showMenu ? "transparent" : "#fff",
      }}
    >
      <Logo showMenu={showMenu} showSearch={showSearch} />

      {!isHome && (
        <AnimatePresence>
          {(!isMobile || (isMobile && !showSearch)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              transition={{ duration: 0.4 }}
            >
              <PageTitle />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div className={styles.controls} typo="h4">
        {showSearchbar && <Searchbar showSearch={showSearch} setShowSearch={setShowSearch} />}

        {(!isMobile || (isMobile && showMenu)) && <LanguageSelection setShowMenu={setShowMenu} />}
        {(!isMobile || (isMobile && showMenu)) && <LoginButton />}

        <MenuButton setShowMenu={setShowMenu} />
      </div>
    </header>
  );
};

export default Header;
