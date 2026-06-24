import styles from "./Label.module.css";

const Label = ({ children, className, outline, onClick }) => (
  <div
    typo="h5"
    className={`${className} ${styles.label}`}
    onClick={onClick}
    style={{
      background: "var(--foreground)",
      color: "var(--background)",
      border: outline ? "1px solid var(--background)" : "",
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: `${outline ? "calc(var(--line-height-5) + 6px)" : "calc(var(--line-height-5) + 8px)"}`,
      padding: "0 8px",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      lineHeight: 1,
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

export default Label;
