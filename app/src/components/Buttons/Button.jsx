const Button = ({ children, className, onClick, style }) => (
  <button
    typo="h5"
    onClick={onClick}
    className={className}
    style={{
      background: "var(--background)",
      color: "var(--foreground)",
      display: "inline-block",
      padding: "8px var(--margin)",
      display: "flex",
      alignItems: "center",
      height: "auto",
      maxHeight: `calc(var(--line-height-5) + 8px)`,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      borderRadius: "10px",
      lineHeight: 1,
      ...style,
    }}
  >
    {children}
  </button>
);

export default Button;
