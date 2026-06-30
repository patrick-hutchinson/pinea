import PineaIcon from "./PineaIcon";
import styles from "./ShopIcon.module.css";

const ShopIcon = ({ className, onClick, src = "/icons/SHOP.svg" }) => {
  const classes = [styles.shopIcon, className].filter(Boolean).join(" ");

  return <PineaIcon className={classes} isShopIcon onClick={onClick} src={src} />;
};

export default ShopIcon;
