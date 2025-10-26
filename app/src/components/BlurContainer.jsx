const BlurContainer = ({ children, className }) => (
  <div
    className={className}
    style={{
      backdropFilter: "blur(var(--blur))",
      position: "relative",
      zIndex: 3,
      width: "100dvw",
      // position: "relative",
      // left: "calc(-1 * var(--margin))",
    }}
  >
    {children}
  </div>
);

export default BlurContainer;
