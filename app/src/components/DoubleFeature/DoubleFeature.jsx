import { renderSide } from "@/helpers/renderSide";
import styles from "./DoubleFeature.module.css";

import MediaPair from "@/components/MediaPair/MediaPair";
import { useState } from "react";

const DoubleFeature = ({ item, className }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    // After 10 seconds, reset hovering
    setTimeout(() => {
      setClicked(false);
    }, 2500); // 10000ms = 10s
  };
  return (
    <MediaPair className={`${clicked && styles.clicked} ${className} ${styles.doubleFeature}`}>
      <div onClick={() => handleClick()}>{renderSide(item.left)}</div>
      <div>{renderSide(item.right)}</div>
    </MediaPair>
  );
};

export default DoubleFeature;
