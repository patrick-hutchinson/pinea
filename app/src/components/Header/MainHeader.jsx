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
import { useContext, useState, useEffect } from "react";

const MainHeader = ({ showMenu, setShowMenu }) => {
  const [showButton, setShowButton] = useState(false);

  const { hasEntered } = useContext(AnimationContext);
  const { isMobile } = useContext(StateContext);
  const pathname = usePathname();
  const transparentHeaders = ["/"];

  useEffect(() => {
    let timer;

    console.log(hasEntered, "has entered?");

    if (hasEntered) {
      // If hasEntered becomes true AFTER page load → delay
      timer = setTimeout(() => setShowButton(true), showButton ? 0 : 2000);
    } else {
      // Hide immediately if user leaves
      setShowButton(false);
    }

    return () => clearTimeout(timer);
  }, [hasEntered]);

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
        {/* {(!isMobile || showButton) && (
          <FadePresence delay={hasEntered ? 0 : 2}>
            <MenuButton setShowMenu={setShowMenu} />
          </FadePresence>
        )} */}
      </div>
    </header>
  );
};

export default MainHeader;
