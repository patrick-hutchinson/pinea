import Icon from "@/components/Icon/Icon";
import { handleShare } from "@/helpers/shareEvent";
import styles from "./Buttons.module.css";

const ShareButton = ({ url, className }) => {
  return (
    <span
      className={`${styles.icon} ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Icon path="/icons/share.svg" onClick={(e) => handleShare(url)} />
    </span>
  );
};

export default ShareButton;
