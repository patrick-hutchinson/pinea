import { useState, useEffect, useMemo } from "react";

import { createPortal } from "react-dom";
import FlipPresenceTwo from "../Animation/FlipPresence/FlipPresenceTwo";
import Media from "../Media/Media";

const getAspectRatio = (medium) => {
  if (!medium) return 1;

  if (Number.isFinite(medium?.width) && Number.isFinite(medium?.height) && medium.height > 0) {
    return medium.width / medium.height;
  }

  if (typeof medium?.aspect_ratio === "string" && medium.aspect_ratio.includes(":")) {
    const [w, h] = medium.aspect_ratio.split(":").map(Number);
    if (Number.isFinite(w) && Number.isFinite(h) && h > 0) return w / h;
  }

  return 1;
};

const FullscreenPreview = ({ showFullscreen, setShowFullscreen, medium, copyright }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const aspectRatio = useMemo(() => getAspectRatio(medium), [medium]);

  if (!mounted) return null;

  const container = document.getElementById("hover-preview");
  if (!container) return null;

  const safeAspectRatio = Math.max(0.2, Math.min(aspectRatio || 1, 5));
  const widthByHeight = `calc((var(--content-vh) - (var(--margin) * 2)) * ${safeAspectRatio})`;

  return createPortal(
    <>
      <FlipPresenceTwo motionKey={showFullscreen ? "animate" : "exit"}>
        <div
          onClick={() => setShowFullscreen(false)}
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "calc(100vw - (var(--margin) * 2))",
              maxHeight: "calc(var(--content-vh) - (var(--margin) * 2))",
              width: `min(calc(100vw - (var(--margin) * 2)), ${widthByHeight})`,
              aspectRatio: safeAspectRatio,
              height: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Media medium={medium} copyright={copyright} isActive={true} objectFit="contain" />
          </div>
        </div>
      </FlipPresenceTwo>

      <div
        onClick={() => setShowFullscreen(false)}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 10,
          top: 0,
          left: 0,
          backdropFilter: showFullscreen ? "blur(20px)" : "blur(0px)",
          WebkitBackdropFilter: showFullscreen ? "blur(20px)" : "blur(0px)",
          opacity: showFullscreen ? 1 : 0,
          transition: "backdrop-filter 1s ease, opacity 0.3s ease",
        }}
      />
    </>,
    container,
  );
};

export default FullscreenPreview;
