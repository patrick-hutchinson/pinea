"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { enableScroll, disableScroll } from "../../helpers/blockScrolling";

import FlipPresence from "../Animation/FlipPresence";
import DummyMenu from "./DummyMenu";

import MainHeader from "./MainHeader";

import FlipPresenceOne from "../Animation/FlipPresence/FlipPresenceOne";
import FlipPresenceTwo from "../Animation/FlipPresence/FlipPresenceTwo";

const Header = ({ site }) => {
  const pathname = usePathname();

  const [showMenu, setShowMenu] = useState(false);

  const ANIMATION_DURATION = 1.2;

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

      <FlipPresenceTwo motionKey={showMenu ? "open" : "closed"} showMenu={showMenu}>
        {showMenu && <DummyMenu site={site} showMenu={showMenu} delay={ANIMATION_DURATION} setShowMenu={setShowMenu} />}
      </FlipPresenceTwo>
    </>
  );
};

export default Header;
