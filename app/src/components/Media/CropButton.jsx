const CropButton = ({ setCropped, cropped }) => (
  <div
    onClick={(e) => {
      e.stopPropagation(); // 👈 prevent parent clicks
      setCropped((prev) => !prev);
    }}
    style={{
      position: "absolute",
      bottom: "35px",
      right: "10px",
      height: "12px",
      width: "fit-content",
      zIndex: 1,
      fontSize: "var(--font-size-5)",
      // transform: "translateX(50%)",
      color: "#000",
      // border: "1px solid #fff",
      padding: "2px 2px",
      lineHeight: 1,
      display: "flex",
      verticalAlign: "center",
      // background: "#fff",
    }}
  >
    {cropped ? "ZOOM IN" : "ZOOM OUT"}
  </div>
);

export default CropButton;
