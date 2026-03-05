import styles from "./BlurContainer.module.css";

const BlurContainer = ({ children, className }) => {
  return (
    <div data-blur-container className={`${styles.blurContainer} ${className || ""}`}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default BlurContainer;
