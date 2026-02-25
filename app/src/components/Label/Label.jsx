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
      display: "inline-block",
      padding: "8px var(--margin)",
      display: "flex",
      alignItems: "center",
      height: "auto",
      maxHeight: `${outline ? "calc(var(--line-height-5) + 6px)" : "calc(var(--line-height-5) + 8px)"}`,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      lineHeight: 1,
    }}
  >
    {children}
  </div>
);

export default Label;
