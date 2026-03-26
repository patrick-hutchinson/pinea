import { useState, useEffect } from "react";

import { createPortal } from "react-dom";
import FlipPresenceTwo from "../Animation/FlipPresence/FlipPresenceTwo";
import Media from "../Media/Media";

const FullscreenPreview = ({ showFullscreen, setShowFullscreen, medium, copyright }) => {
  const [mounted, setMounted] = useState(false);
  const [isChromeMobile, setIsChromeMobile] = useState(false);

  useEffect(() => {
    setMounted(true);

    const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const isChromeLike = /Chrome|CriOS/i.test(ua);
    const isEdgeOrOpera = /Edg|OPR|SamsungBrowser/i.test(ua);
    setIsChromeMobile(isMobile && isChromeLike && !isEdgeOrOpera);
  }, []);

  if (!mounted) return null;

  const container = document.getElementById("hover-preview");
  if (!container) return null;

  return createPortal(
    <>
      <FlipPresenceTwo motionKey={showFullscreen ? "animate" : "exit"} showMenu={true}>
        <div
          onClick={() => setShowFullscreen(false)}
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform, opacity",
            isolation: "isolate",
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
              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
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
          background: "rgba(0, 0, 0, 0.12)",
          backdropFilter: !isChromeMobile && showFullscreen ? "blur(20px)" : "none",
          WebkitBackdropFilter: !isChromeMobile && showFullscreen ? "blur(20px)" : "none",
          opacity: showFullscreen ? 1 : 0,
          transition: "backdrop-filter 1s ease, opacity 0.3s ease",
        }}
      />
    </>,
    container,
  );
};

export default FullscreenPreview;
