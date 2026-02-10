"use client";

import { useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import { StateContext } from "@/context/StateContext";
import { MenuContext } from "@/context/MenuContext";
import { AnimationContext } from "@/context/AnimationContext";

import { enableScroll, disableScroll } from "@/helpers/blockScrolling";

import Searchbar from "../Search/Searchbar";
import Logo from "./components/Logo";
import PageTitle from "./components/PageTitle";
import MenuButton from "./components/MenuButton";
import LanguageSelection from "./components/LanguageSelection";
import LoginButton from "./components/LoginButton";

import styles from "./Header.module.css";

const Header = () => {
  const { hasEntered } = useContext(AnimationContext);
  const { isMobile } = useContext(StateContext);
  const pathname = usePathname();

  const isHome = pathname === "/";

  const [showSearch, setShowSearch] = useState(false);

  const { showMenu, setShowMenu } = useContext(MenuContext);

  // Close Menu on Navigation
  useEffect(() => {
    setShowMenu(false);
    hasEntered && enableScroll();
    pathname !== "/" && enableScroll();
  }, [pathname]);

  useEffect(() => {
    showMenu ? disableScroll() : hasEntered && enableScroll();
  }, [showMenu, hasEntered]);

  const showSearchbar = !(isMobile && showMenu);

  const headerVariants = {
    hidden: {
      filter: "none",
      transition: { duration: 0.4 },
    },
    shown: {
      filter: "invert(1)",
      transition: { duration: 0.4, delay: 0.3 },
    },
  };

  return (
    <motion.header
      className={`${styles.header} ${showMenu && styles.menuIsVisible}`}
      style={{
        background: showMenu || isHome ? "transparent" : "#fff",
        background: "transparent",
      }}
    >
      <motion.div
        className={styles.header_inner}
        variants={headerVariants}
        initial="hidden"
        animate={showMenu ? "shown" : "hidden"}
        exit="hidden"
      >
        <Logo showMenu={showMenu} showSearch={showSearch} />

        {!isHome && (
          <AnimatePresence>
            {!showMenu && (!isMobile || !showSearch) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.4 } }}
                transition={{ duration: 0.4 }}
                style={{ zIndex: 40, pointerEvents: "all" }}
              >
                <PageTitle />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <div className={styles.controls} typo="h4">
          <Searchbar
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            showSearchbar={showSearchbar}
            showMenu={showMenu}
          />

          <LanguageSelection setShowMenu={setShowMenu} showMenu={showMenu} isMobile={isMobile} />
          <LoginButton showMenu={showMenu} isMobile={isMobile} />

          <MenuButton setShowMenu={setShowMenu} />
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
