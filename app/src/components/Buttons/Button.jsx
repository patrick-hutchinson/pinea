const Button = ({ children, className, onClick, style, type = "button", ...props }) => (
  <button
    type={type}
    typo="h5"
    onClick={onClick}
    className={className}
    {...props}
    style={{
      background: "var(--background)",
      color: "var(--foreground)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "calc(var(--line-height-5) + 8px)",
      padding: "0 var(--margin)",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      borderRadius: "10px",
      lineHeight: 1,
      appearance: "none",
      WebkitAppearance: "none",
      ...style,
    }}
  >
    {children}
  </button>
);

export default Button;
