"use client";

import { useContext } from "react";

import { MenuContext } from "@/context/MenuContext";

import MenuContent from "./MenuContent";

import MenuTransition from "../Animation/MenuTransition";

import styles from "./Menu.module.css";

const Menu = ({ site, menu, shopEnabled = false }) => {
  const { showMenu } = useContext(MenuContext);

  return (
    <MenuTransition show={showMenu}>
      {showMenu && (
        <div className={styles.dummy} style={{ background: "#000", width: "100vw", height: "100vh" }}>
          <MenuContent site={site} menu={menu} shopEnabled={shopEnabled} />
        </div>
      )}
    </MenuTransition>
  );
};

export default Menu;
