import Icon from "@/components/Icon/Icon";
import styles from "./PineaIcon.module.css";

const PineaIcon = ({ className, onClick }) => {
  return <Icon className={`${className} ${styles.pineaIcon}`} onClick={onClick} path="icons/pinea_rechteck.svg" />;
};

export default PineaIcon;
