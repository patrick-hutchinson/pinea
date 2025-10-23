const Label = ({ children, className }) => (
  <div
    typo="h5"
    className={className}
    style={{
      background: "var(--foreground)",
      color: "var(--background)",
      display: "inline-block",
      padding: "4px 12px",
      display: "flex",
      alignItems: "center",
      height: "auto",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

export default Label;
