import { renderSide } from "@/helpers/renderSide";
import styles from "./DoubleFeature.module.css";

import MediaPair from "@/components/MediaPair/MediaPair";
import { StateContext } from "@/context/StateContext";
import { useContext, useEffect, useRef, useState } from "react";

const DoubleFeature = ({ item, className }) => {
  const { isMobile } = useContext(StateContext);
  const [clicked, setClicked] = useState(false);
  const clickTimeoutRef = useRef(null);

  const handleClick = () => {
    if (!isMobile) return;

    window.clearTimeout(clickTimeoutRef.current);
    setClicked(true);
    clickTimeoutRef.current = window.setTimeout(() => {
      setClicked(false);
    }, 10000);
  };

  useEffect(
    () => () => {
      window.clearTimeout(clickTimeoutRef.current);
    },
    [],
  );

  return (
    <MediaPair className={`${isMobile && clicked ? styles.clicked : ""} ${className} ${styles.doubleFeature}`}>
      <div onClick={() => handleClick()}>{renderSide(item.left, { autoHideTapCopyrightDuration: 10000 })}</div>
      <div>{renderSide(item.right, { autoHideTapCopyrightDuration: 10000 })}</div>
    </MediaPair>
  );
};

export default DoubleFeature;
