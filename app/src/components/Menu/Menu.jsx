"use client";

import { useContext } from "react";

import { MenuContext } from "@/context/MenuContext";
import { StateContext } from "@/context/StateContext";

import MenuContent from "./MenuContent";

import FlipPresenceThree from "../Animation/FlipPresence/FlipPresenceThree";

import styles from "./Menu.module.css";

const Menu = ({ site, menu }) => {
  const { showMenu } = useContext(MenuContext);
  const { isSafari } = useContext(StateContext);

  return (
    <FlipPresenceThree animation={isSafari ? "fade" : "flip"} motionKey={showMenu} showMenu={showMenu}>
      {showMenu && (
        <div className={styles.dummy} style={{ background: "#000", width: "100vw", height: "100vh" }}>
          <MenuContent site={site} menu={menu} />
        </div>
      )}
    </FlipPresenceThree>
  );
};

export default Menu;
