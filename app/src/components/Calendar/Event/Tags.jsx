import styles from "../Calendar.module.css";

import Label from "@/components/Label/Label";
import Icon from "@/components/Icon/Icon";

const Tags = ({ event, setShowGallery, hidePinnedTag = false }) => {
  const hasGallery = Array.isArray(event.gallery) && event.gallery.length > 0;
  const canToggleGallery = hasGallery && typeof setShowGallery === "function";

  const toggleGallery = () => {
    setShowGallery((prev) => !prev);
  };

  return (
    <div className={styles.tags}>
      {event.recommendation && <Label className={styles.notice}>RECOMMENDED</Label>}
      {event.highlight?.hosted && <Label className={styles.notice}>HOSTED</Label>}
      {!hidePinnedTag && event.highlight?.pinned && <Label className={styles.notice}>PINNED</Label>}
      {canToggleGallery && (
        <Icon path="/icons/gallery-button.svg" className={styles.icon} onClick={() => toggleGallery(event)} />
      )}
    </div>
  );
};

export default Tags;
