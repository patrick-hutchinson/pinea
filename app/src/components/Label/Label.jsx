const Label = ({ children, className, outline, onClick }) => (
  <div
    typo="h5"
    className={`${className}`}
    onClick={onClick}
    style={{
      background: "var(--foreground)",
      color: "var(--background)",
      border: outline ? "1px solid var(--background)" : "",
      display: "inline-block",
      padding: "4px 8px",
      display: "flex",
      alignItems: "center",
      height: "auto",
      maxHeight: `calc(var(--line-height-5) + 8px)`,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

export default Label;
