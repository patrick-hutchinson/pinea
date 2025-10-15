import ZoomImage from "@/components/ZoomImage/ZoomImage";
import Text from "@/components/Text";

import styles from "./Feature.module.css";

const Feature = ({ features }) => {
  const random = Math.floor(Math.random() * features.length);
  const feature = features[random];

  return (
    <div className={styles.feature}>
      <div className={styles.media}>
        <ZoomImage feature={feature} />
      </div>
      <Text text={feature.description} className={styles.description} typo="longcopy" />
    </div>
  );
};

export default Feature;
