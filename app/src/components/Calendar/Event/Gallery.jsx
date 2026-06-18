import styles from "../Calendar.module.css";

import BlurMedia from "@/components/BlurMedia/BlurMedia";
import Satellite from "@/components/Satellite/Satellite";

const Gallery = ({ event }) => {
  const hasThumbnail = event.thumbnail && event.thumbnail.mediaType !== "none";

  return (
    <div className={styles.gallery}>
      {hasThumbnail && <BlurMedia className={styles.blurMedia} medium={event.thumbnail} />}
      <Satellite media={event.gallery} behaviour="expand" />
    </div>
  );
};

export default Gallery;
