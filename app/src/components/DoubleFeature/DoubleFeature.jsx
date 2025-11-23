import { renderSide } from "@/helpers/renderSide";
import styles from "./DoubleFeature.module.css";

import MediaPair from "@/components/MediaPair/MediaPair";

const DoubleFeature = ({ item, className }) => (
  <MediaPair className={`${className} ${styles.doubleFeature}`}>
    <div>{renderSide(item.left)}</div>
    <div>{renderSide(item.right)}</div>
  </MediaPair>
);

export default DoubleFeature;
