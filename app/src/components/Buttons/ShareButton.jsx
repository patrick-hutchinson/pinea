import Icon from "@/components/Icon/Icon";
import { handleShare } from "@/helpers/shareEvent";

const ShareButton = ({ url, className }) => {
  return (
    <span
      style={{ height: "14px", width: "14px", aspectRatio: 1, cursor: "pointer" }}
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Icon path="icons/share.svg" onClick={(e) => handleShare(url)} />
    </span>
  );
};

export default ShareButton;
