import { usePathname } from "next/navigation";

import Logo from "./Logo";
import PageTitle from "./PageTitle";
import Menu from "./Menu/Promo";
import MenuButton from "./Menu/MenuButton";
import HeaderControls from "./HeaderControls";

import { AnimationContext } from "@/context/AnimationContext";
import { StateContext } from "@/context/StateContext";

import FadePresence from "@/components/Animation/FadePresence";

import styles from "./Header.module.css";
import { useContext } from "react";

const MainHeader = ({ showMenu, setShowMenu }) => {
  const { hasEntered } = useContext(AnimationContext);
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

      <div className={styles.controls_wrapper}>
        <HeaderControls typo="h4" />
        {(!isMobile || hasEntered) && (
          <FadePresence delay={2}>
            <MenuButton setShowMenu={setShowMenu} />
          </FadePresence>
        )}
      </div>
    </header>
  );
};

export default MainHeader;
