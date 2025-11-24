import Media from "@/components/Media/Media";

import styles from "./FrameFeature.module.css";

const FrameFeature = ({ medium, frame }) => {
  return (
    <div className={styles.frame_container}>
      <img src={frame.asset.url} alt="" />
      <Media className={styles.frame_inner} medium={medium} />
    </div>
  );
};

export default FrameFeature;
