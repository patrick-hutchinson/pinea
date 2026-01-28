"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { enableScroll, disableScroll } from "../../helpers/blockScrolling";

import Menu from "./Menu";

import MainHeader from "./MainHeader";

import FlipPresenceThree from "../Animation/FlipPresence/FlipPresenceThree";

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

  return (
    <>
      <MainHeader showMenu={showMenu} setShowMenu={setShowMenu} />

      <FlipPresenceThree motionKey={showMenu} showMenu={showMenu}>
        {showMenu && <Menu site={site} showMenu={showMenu} setShowMenu={setShowMenu} />}
      </FlipPresenceThree>
    </>
  );
};

export default Header;
