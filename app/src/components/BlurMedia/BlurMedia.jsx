import Media from "@/components/Media/Media";

const BlurMedia = ({ children, medium, className }) => (
  <div
    className={className}
    style={{
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      position: "absolute",
      top: "0",
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

    {children}
  </div>
);

export default BlurMedia;
