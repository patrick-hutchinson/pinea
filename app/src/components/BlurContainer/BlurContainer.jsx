import styles from "./BlurContainer.module.css";

const BlurContainer = ({ children, className }) => {
  return (
    <div
      className={`${styles.blurContainer} ${className}`}
      style={{
        backdropFilter: "blur(var(--blur))",
        position: "relative",
        zIndex: 10,
        width: "100vw",
        minHeight: "var(--content-vh)",
        transform: "translateZ(0)",
        willChange: "backdrop-filter",
      }}
    >
      {children}
    </div>
  );
};

export default BlurContainer;
