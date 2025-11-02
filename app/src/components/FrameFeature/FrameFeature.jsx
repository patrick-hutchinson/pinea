import Media from "@/components/Media/Media";

import styles from "./FrameFeature.module.css";

const FrameFeature = ({ medium }) => {
  return (
    <div className={styles.frame_container}>
      <img src="/images/editionsframe.jpg" alt="" />
      <Media className={styles.frame_inner} medium={medium} />
    </div>
  );
};

export default FrameFeature;
