const Notice = ({ children, className }) => (
  <div
    className={`ff5 ${className}`}
    style={{
      background: "var(--foreground)",
      color: "var(--background)",
      display: "inline-block",
      padding: "6px 12px",
      height: "fit-content",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

export default Notice;
