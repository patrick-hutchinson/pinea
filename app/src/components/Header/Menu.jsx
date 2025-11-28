import MainHeader from "./MainHeader";
import Promo from "./Menu/Promo";
import Navigation from "./Menu/Navigation";
import FadePresence from "@/components/Animation/FadePresence";

import styles from "./Header.module.css";

const Menu = ({ site, showMenu, setShowMenu }) => {
  console.log("showMenu", showMenu);
  return (
    <div className={styles.dummy} style={{ background: "#000", width: "100vw", height: "100vh" }}>
      <FadePresence motionKey={showMenu ? "open" : "closed"}>
        <div className={styles.menu_inner}>
          <MainHeader showMenu={showMenu} setShowMenu={setShowMenu} />
          <Promo site={site} />
          <Navigation site={site} />
        </div>
      </FadePresence>
    </div>
  );
};

export default Menu;
