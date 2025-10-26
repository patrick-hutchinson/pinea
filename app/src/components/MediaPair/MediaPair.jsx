import styles from "./MediaPair.module.css";

const MediaPair = ({ children, className }) => {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
};

export default MediaPair;
