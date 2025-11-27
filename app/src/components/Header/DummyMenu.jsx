import MainHeader from "./MainHeader";
import Menu from "./Menu/Menu";
import Navigation from "./Menu/Navigation";
import FadePresence from "@/components/Animation/FadePresence";

import styles from "./Header.module.css";

const DummyMenu = ({ site, delay, showMenu, setShowMenu }) => {
  console.log("showMenu", showMenu);
  return (
    <div className={styles.dummy} style={{ background: "#000", width: "100vw", height: "100vh" }}>
      <FadePresence motionKey={showMenu ? "open" : "closed"} delay={showMenu ? delay : 0}>
        {showMenu && (
          <div className={styles.menu_inner}>
            <MainHeader showMenu={showMenu} setShowMenu={setShowMenu} />
            <Menu site={site} />
            <Navigation site={site} />
          </div>
        )}
      </FadePresence>
    </div>
  );
};

export default DummyMenu;
