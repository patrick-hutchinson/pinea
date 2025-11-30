import styles from "./MediaPair.module.css";

const MediaPair = ({ children, className, id }) => {
  return (
    <div className={`${styles.container} ${className}`} id={id}>
      {children}
    </div>
  );
};

export default MediaPair;
