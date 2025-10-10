const Notice = ({ children }) => (
  <div
    className="ff5"
    style={{
      background: "var(--foreground)",
      color: "var(--background)",
      display: "inline-block",
      padding: "0px 12px",
      height: "fit-content",
      textTransform: "uppercase",
      position: "relative",
      top: "5px",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

export default Notice;
