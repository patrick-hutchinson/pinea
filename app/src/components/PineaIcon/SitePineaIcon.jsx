import PineaIcon from "./PineaIcon";
import styles from "./SitePineaIcon.module.css";

const SitePineaIcon = ({ className, onClick }) => {
  const classes = [styles.sitePineaIcon, className].filter(Boolean).join(" ");

  return <PineaIcon className={classes} onClick={onClick} />;
};

export default SitePineaIcon;
