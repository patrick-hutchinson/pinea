import Icon from "@/components/Icon/Icon";
import { handleShare } from "@/helpers/shareEvent";

const ShareButton = ({ url }) => {
  return (
    <span style={{ height: "14px", width: "14px", aspectRatio: 1, cursor: "pointer" }}>
      <Icon path="icons/share.svg" onClick={() => handleShare(url)} />
    </span>
  );
};

export default ShareButton;
