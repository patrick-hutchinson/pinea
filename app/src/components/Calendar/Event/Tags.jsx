import styles from "../Calendar.module.css";

import Label from "@/components/Label";
import Icon from "@/components/Icon";

const Tags = ({ event, setShowGallery }) => {
  const toggleGallery = () => {
    setShowGallery((prev) => !prev);
  };

  return (
    <div className={styles.tags}>
      {event.recommendations && <Label className={styles.notice}>RECOMMENDED</Label>}
      {event.pinned && <Label className={styles.notice}>SELECTED BY PINEA</Label>}
      {event.gallery && (
        <Icon path="/icons/gallery-button.svg" className={styles.icon} onClick={() => toggleGallery(event)} />
      )}
    </div>
  );
};

export default Tags;
