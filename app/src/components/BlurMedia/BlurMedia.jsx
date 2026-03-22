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
      left: "0",
      isolation: "isolate",
      contain: "paint",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        filter: "blur(20px)",
        transform: "translateZ(0) scale(1.4)",
        WebkitTransform: "translateZ(0) scale(1.4)",
        willChange: "transform, filter",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Media medium={medium} />
    </div>

    {children}
  </div>
);

export default BlurMedia;
