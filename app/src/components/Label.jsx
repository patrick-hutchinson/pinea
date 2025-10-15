const Label = ({ children, className }) => (
  <div
    typo="h5"
    className={className}
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

export default Label;
