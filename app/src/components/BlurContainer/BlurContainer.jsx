const BlurContainer = ({ children, className }) => {
  return (
    <div
      className={className}
      style={{
        backdropFilter: "blur(var(--blur))",
        position: "relative",
        zIndex: 3,
        width: "100vw",
        minHeight: "var(--content-vh)",
      }}
    >
      {children}
    </div>
  );
};

export default BlurContainer;
