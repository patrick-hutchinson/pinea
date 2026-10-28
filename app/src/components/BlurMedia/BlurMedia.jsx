import Media from "@/components/Media/Media";
import { buildMediaImageSource } from "@/components/Media/hooks/useImageSource";

const BlurMedia = ({ children, medium, className, loadEager = false }) => (
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
      // left: "0",
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
      {medium?.type === "image" && medium.url ? (
        <img
          src={buildMediaImageSource(medium, { width: 160 })}
          alt=""
          aria-hidden="true"
          draggable={false}
          loading={loadEager ? "eager" : "lazy"}
          fetchPriority={loadEager ? "high" : undefined}
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <Media medium={medium} loadEager={loadEager} />
      )}
    </div>

    {children}
  </div>
);

export default BlurMedia;
