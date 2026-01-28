import { usePathname } from "next/navigation";

import Logo from "./Logo";
import PageTitle from "./PageTitle";

import MenuButton from "./Menu/MenuButton";
import HeaderControls from "./HeaderControls";

import { StateContext } from "@/context/StateContext";

import styles from "./Header.module.css";
import { useContext, useState } from "react";
import Searchbar from "../Search/Searchbar";
import { AnimatePresence, motion } from "framer-motion";

import LanguageSelection from "./Menu/LanguageSelection";
import LoginButton from "./Menu/LoginButton";

const MainHeader = ({ showMenu, setShowMenu }) => {
  const { isMobile } = useContext(StateContext);
  const pathname = usePathname();

  const isHome = pathname === "/";

  const [showSearch, setShowSearch] = useState(false);

  return (
    <header
      className={`${styles.header}`}
      style={{
        background: isHome ? "transparent" : "#fff",
      }}
    >
      <Logo showMenu={showMenu} showSearch={showSearch} />

      {!isHome && (
        <AnimatePresence>
          {isMobile && !showSearch && (
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
        <Searchbar showSearch={showSearch} setShowSearch={setShowSearch} />

        {!isMobile && <LanguageSelection setShowMenu={setShowMenu} />}
        {!isMobile && <LoginButton />}

        <MenuButton setShowMenu={setShowMenu} />
      </div>
    </header>
  );
};

export default MainHeader;
