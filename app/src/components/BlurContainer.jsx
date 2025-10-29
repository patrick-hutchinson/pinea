const BlurContainer = ({ children, className }) => (
  <div
    className={className}
    style={{
      backdropFilter: "blur(var(--blur)) contrast(0.5)",
      position: "relative",
      zIndex: 3,
      width: "100dvw",
    }}
  >
    {children}
  </div>
);

export default BlurContainer;
