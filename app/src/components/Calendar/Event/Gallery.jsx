import styles from "../Calendar.module.css";

import BlurMedia from "@/components/BlurMedia/BlurMedia";
import Satellite from "@/components/Satellite/Satellite";

const Gallery = ({ event }) => {
  return (
    <div className={styles.gallery}>
      <BlurMedia medium={event.thumbnail} />
      <Satellite media={event.gallery} />
    </div>
  );
};

export default Gallery;
