import Media from "@/components/Media/Media";

import styles from "./FullscreenMedia.module.css";

const FullscreenMedia = ({ medium }) => {
  return (
    <div className={styles.media_container}>
      <Media medium={medium} />
    </div>
  );
};

export default FullscreenMedia;
