import styles from "./Label.module.css";

const Label = ({ children, className, outline, onClick }) => (
  <div
    typo="h5"
    className={[className, styles.label, outline ? styles.outline : ""].filter(Boolean).join(" ")}
    onClick={onClick}
  >
    <span className={styles.labelText}>{children}</span>
  </div>
);

export default Label;
