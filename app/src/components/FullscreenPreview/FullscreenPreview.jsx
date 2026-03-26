import { useState, useEffect, useMemo } from "react";

import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import FlipPresenceTwo from "../Animation/FlipPresence/FlipPresenceTwo";
import Media from "../Media/Media";
import { useLenisContext } from "@/context/LenisContext";

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
  const [isFirefoxMobile, setIsFirefoxMobile] = useState(false);
  const lenis = useLenisContext();

  useEffect(() => {
    setMounted(true);

    const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const isFirefox = /Firefox|FxiOS/i.test(ua);
    setIsFirefoxMobile(isMobile && isFirefox);
  }, []);

  useEffect(() => {
    if (!showFullscreen) return undefined;

    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyTouchAction = body.style.touchAction;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.touchAction = "none";

    if (lenis?.stop) lenis.stop();

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.touchAction = previousBodyTouchAction;

      if (lenis?.start) lenis.start();
    };
  }, [showFullscreen, lenis]);

  const aspectRatio = useMemo(() => getAspectRatio(medium), [medium]);

  if (!mounted) return null;

  const container = document.getElementById("hover-preview");
  if (!container) return null;

  const safeAspectRatio = Math.max(0.2, Math.min(aspectRatio || 1, 5));
  const widthByHeight = `calc((100dvh - (var(--margin) * 2)) * ${safeAspectRatio})`;

  const mediaNode = (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        maxWidth: "calc(100vw - (var(--margin) * 2))",
        maxHeight: "calc(100dvh - (var(--margin) * 2))",
        width: `min(calc(100vw - (var(--margin) * 2)), ${widthByHeight})`,
        aspectRatio: safeAspectRatio,
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Media
        medium={medium}
        copyright={copyright}
        isActive={true}
        objectFit="contain"
        loadEager={true}
        skipPlaceholder={true}
      />
    </div>
  );

  return createPortal(
    <>
      {isFirefoxMobile ? (
        <div
          onClick={() => setShowFullscreen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            height: "100dvh",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {mediaNode}
          </motion.div>
        </div>
      ) : (
        <FlipPresenceTwo motionKey={showFullscreen ? "animate" : "exit"}>
          <div
            onClick={() => setShowFullscreen(false)}
            style={{
              position: "relative",
              width: "100vw",
              minHeight: "100vh",
              height: "100dvh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {mediaNode}
          </div>
        </FlipPresenceTwo>
      )}

      <div
        onClick={() => setShowFullscreen(false)}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100dvh",
          minHeight: "100vh",
          zIndex: 10,
          background: "rgba(0, 0, 0, 0.12)",
          backdropFilter: isFirefoxMobile ? "none" : showFullscreen ? "blur(20px)" : "blur(0px)",
          WebkitBackdropFilter: isFirefoxMobile ? "none" : showFullscreen ? "blur(20px)" : "blur(0px)",
          opacity: showFullscreen ? 1 : 0,
          transition: "backdrop-filter 1s ease, opacity 0.3s ease",
        }}
      />
    </>,
    container,
  );
};

export default FullscreenPreview;
