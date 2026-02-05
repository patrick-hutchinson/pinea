import Icon from "@/components/Icon/Icon";
import { handleShare } from "@/helpers/shareEvent";
import styles from "./Buttons.module.css";

const DropdownButton = ({ className }) => {
  return (
    <span
      className={`${styles.dropdownButton} ${styles.icon} ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Icon path="/icons/dropdown-button.svg" onClick={(e) => handleShare(url)} />
    </span>
  );
};

export default DropdownButton;
