import { useState, useEffect } from "react";

import { createPortal } from "react-dom";
import FlipPresenceTwo from "../Animation/FlipPresence/FlipPresenceTwo";
import Media from "../Media/Media";

const FullscreenPreview = ({ showFullscreen, setShowFullscreen, medium, copyright }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true); // now document exists
  }, []);

  if (!mounted) return null;

  const container = document.getElementById("hover-preview");
  if (!container) return null; // fallback if container not in DOM

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
              width: "auto",
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
          opacity: showFullscreen ? 1 : 0,
          transition: "backdrop-filter 1s ease, opacity 0.3s ease",
        }}
      />
    </>,
    container,
  );
};

export default FullscreenPreview;
