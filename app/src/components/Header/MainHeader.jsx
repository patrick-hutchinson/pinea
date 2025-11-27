import { usePathname } from "next/navigation";

import Logo from "./Logo";
import PageTitle from "./PageTitle";
import Menu from "./Menu/Menu";
import MenuButton from "./Menu/MenuButton";
import HeaderControls from "./HeaderControls";

import styles from "./Header.module.css";

const MainHeader = ({ showMenu, setShowMenu }) => {
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

      <div className={styles.controls_wrapper}>
        <HeaderControls typo="h4" />
        <MenuButton setShowMenu={setShowMenu} />
      </div>
    </header>
  );
};

export default MainHeader;
