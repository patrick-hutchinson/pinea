import { useState } from "react";
import styles from "../Header.module.css";

const MenuButton = ({ setShowMenu }) => {
  const [animating, setAnimating] = useState(false);
  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleMouseEnter = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500); // allow full animation
  };

  return (
    <div className={styles.menuButton_wrapper} onMouseEnter={handleMouseEnter} onClick={() => toggleMenu()}>
      <div className={`${styles.menuButton} ${animating ? styles.animate : ""}`} />
    </div>
  );
};

export default MenuButton;
