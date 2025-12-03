import styles from "../Calendar.module.css";
import CropButton from "@/components/Media/CropButton";

import Label from "@/components/Label/Label";
import Icon from "@/components/Icon/Icon";
import { StateContext } from "@/context/StateContext";
import { useContext } from "react";

const Tags = ({ event, setShowGallery }) => {
  const { isMobile } = useContext(StateContext);
  const toggleGallery = () => {
    setShowGallery((prev) => !prev);
  };

  return (
    <div className={styles.tags}>
      {isMobile && <CropButton className={styles.cropButton} />}
      {event.recommendation && <Label className={styles.notice}>RECOMMENDED</Label>}
      {event.highlight?.hosted && <Label className={styles.notice}>HOSTED</Label>}
      {event.highlight?.pinned && <Label className={styles.notice}>PINNED</Label>}
      {event.gallery && (
        <Icon path="/icons/gallery-button.svg" className={styles.icon} onClick={() => toggleGallery(event)} />
      )}
    </div>
  );
};

export default Tags;
