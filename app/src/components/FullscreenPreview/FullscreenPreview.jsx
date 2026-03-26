import { useState, useEffect } from "react";

import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import FlipPresenceTwo from "../Animation/FlipPresence/FlipPresenceTwo";
import Media from "../Media/Media";

const FullscreenPreview = ({ showFullscreen, setShowFullscreen, medium, copyright }) => {
  const [mounted, setMounted] = useState(false);
  const [useMobileSafeMode, setUseMobileSafeMode] = useState(false);

  useEffect(() => {
    setMounted(true);

    const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const isIOSSafari =
      /iPhone|iPad|iPod/i.test(ua) &&
      /Safari/i.test(ua) &&
      !/CriOS|FxiOS|EdgiOS|OPiOS|SamsungBrowser/i.test(ua);

    // Keep the original 3D animation where it is known to work well (iOS Safari + desktop),
    // use safer compositing on other mobile browsers (Chrome/Firefox/etc.).
    setUseMobileSafeMode(isMobile && !isIOSSafari);
  }, []);

  if (!mounted) return null;

  const container = document.getElementById("hover-preview");
  if (!container) return null;

  const mediaContent = (
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
  );

  return createPortal(
    <>
      {useMobileSafeMode ? (
        <div
          onClick={() => setShowFullscreen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--margin)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{
              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: "transform, opacity",
            }}
          >
            {mediaContent}
          </motion.div>
        </div>
      ) : (
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
            }}
          >
            {mediaContent}
          </div>
        </FlipPresenceTwo>
      )}

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
          backdropFilter: !useMobileSafeMode && showFullscreen ? "blur(20px)" : "none",
          WebkitBackdropFilter: !useMobileSafeMode && showFullscreen ? "blur(20px)" : "none",
          opacity: showFullscreen ? 1 : 0,
          transition: "backdrop-filter 1s ease, opacity 0.3s ease",
        }}
      />
    </>,
    container,
  );
};

export default FullscreenPreview;
