"use client";

import { useContext } from "react";

import { MenuContext } from "@/context/MenuContext";

import MenuContent from "./MenuContent";

import FlipPresenceThree from "../Animation/FlipPresence/FlipPresenceThree";

import styles from "./Menu.module.css";

const Menu = ({ site }) => {
  const { showMenu } = useContext(MenuContext);

  return (
    <FlipPresenceThree motionKey={showMenu} showMenu={showMenu}>
      {showMenu && (
        <div className={styles.dummy} style={{ background: "#000", width: "100vw", height: "100vh" }}>
          <MenuContent site={site} />
        </div>
      )}
    </FlipPresenceThree>
  );
};

export default Menu;
