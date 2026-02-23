import styles from "./BlurContainer.module.css";

const BlurContainer = ({ children, className }) => {
  return (
    // <div className={`${styles.blurContainer} ${className || ""}`}>
    //   <div className={styles.content}>{children}</div>
    // </div>
    <div
      className={`${styles.blurContainer} ${className}`}
      style={{
        backdropFilter: "blur(var(--blur))",
        position: "relative",
        zIndex: 10,
        inset: 0,
        // zIndex: 0,
        width: "100vw",
        minHeight: "var(--content-vh)",
        viewTransitionName: "none",
      }}
    >
      <div style={{ position: "relative", zIndex: 11 }}>{children}</div>
    </div>
  );
};

export default BlurContainer;
