import Media from "@/components/Media";

const BlurMedia = ({ medium, className }) => {
  return (
    <div
      style={{
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
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
        <Media medium={medium} />
      </div>

      <div style={{ maxWidth: "80%", maxHeight: "80%", position: "relative", zIndex: 1 }}>
        <Media medium={medium} />
      </div>
    </div>
  );
};

export default BlurMedia;
