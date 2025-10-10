import styles from "./MediaPair.module.css";

const MediaPair = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default MediaPair;
