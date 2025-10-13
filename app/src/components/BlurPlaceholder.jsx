const BlurPlaceholder = ({ children, source }) => (
  <div
    style={{
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "calc(100% + 4.5px)",
      position: "absolute",
      top: "0",
      left: " -4.5px",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        filter: "blur(20px)",
        transform: "scale(1.4)",
        zIndex: 0,
      }}
    >
      <img src={source} alt="" />
    </div>

    {children}
  </div>
);

export default BlurPlaceholder;
