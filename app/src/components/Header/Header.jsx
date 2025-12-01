"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { enableScroll, disableScroll } from "../../helpers/blockScrolling";

import FlipPresence from "../Animation/FlipPresence";
import { motion } from "framer-motion";
import Menu from "./Menu";

import MainHeader from "./MainHeader";

import FlipPresenceOne from "../Animation/FlipPresence/FlipPresenceOne";
import FlipPresenceTwo from "../Animation/FlipPresence/FlipPresenceTwo";
import FlipPresenceThree from "../Animation/FlipPresence/FlipPresenceThree";

import { AnimatePresence } from "framer-motion";

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

      <FlipPresenceThree motionKey={showMenu} showMenu={showMenu}>
        {showMenu && <Menu site={site} showMenu={showMenu} setShowMenu={setShowMenu} />}
      </FlipPresenceThree>
    </>
  );
};

export default Header;
