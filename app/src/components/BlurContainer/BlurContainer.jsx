import styles from "./BlurContainer.module.css";

const BlurContainer = ({ children, className }) => {
  return (
    <div className={`${styles.blurContainer} ${className || ""}`}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default BlurContainer;
