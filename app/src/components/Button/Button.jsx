const Button = ({ children, className, onClick }) => (
  <button
    typo="h5"
    onClick={onClick}
    className={`${className}`}
    style={{
      background: "var(--background)",
      color: "var(--foreground)",
      display: "inline-block",
      padding: "4px 8px",
      display: "flex",
      alignItems: "center",
      height: "auto",
      maxHeight: `calc(var(--line-height-5) + 8px)`,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      borderRadius: "10px",
    }}
  >
    {children}
  </button>
);

export default Button;
