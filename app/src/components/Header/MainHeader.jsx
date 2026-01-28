import { usePathname } from "next/navigation";

import Logo from "./Logo";
import PageTitle from "./PageTitle";

import MenuButton from "./Menu/MenuButton";
import HeaderControls from "./HeaderControls";

import { StateContext } from "@/context/StateContext";

import styles from "./Header.module.css";
import { useContext } from "react";
import Searchbar from "../Search/Searchbar";

const MainHeader = ({ showMenu, setShowMenu }) => {
  const { isMobile } = useContext(StateContext);
  const pathname = usePathname();
  const transparentHeaders = ["/"];

  return (
    <header
      className={`${styles.header}`}
      style={{
        background: transparentHeaders.includes(pathname) ? "transparent" : "#fff",
      }}
    >
      <Logo showMenu={showMenu} />

      <PageTitle />

      {isMobile && <Searchbar />}

      <div className={styles.controls_wrapper}>
        <HeaderControls typo="h4" setShowMenu={setShowMenu} />
        <MenuButton setShowMenu={setShowMenu} />
      </div>
    </header>
  );
};

export default MainHeader;
