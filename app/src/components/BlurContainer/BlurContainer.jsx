const BlurContainer = ({ children, className }) => (
  <div
    className={className}
    style={{
      backdropFilter: "blur(var(--blur))",
      position: "relative",
      zIndex: 3,
      width: "100vw",
    }}
  >
    {children}
  </div>
);

export default BlurContainer;
