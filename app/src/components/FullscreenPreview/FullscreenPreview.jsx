import { useState, useEffect, useMemo, useRef } from "react";

import { createPortal } from "react-dom";
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
  const [hasOpened, setHasOpened] = useState(false);
  const [isBackdropResolving, setIsBackdropResolving] = useState(false);
  const lockedStylesRef = useRef(null);
  const lenis = useLenisContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showFullscreen) return;

    setHasOpened(true);
    setIsBackdropResolving(false);

    if (lockedStylesRef.current) return;

    lockedStylesRef.current = {
      htmlOverflow: document.documentElement.style.overflow,
      bodyOverflow: document.body.style.overflow,
      bodyTouchAction: document.body.style.touchAction,
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    lenis?.stop?.();
  }, [showFullscreen, lenis]);

  const unlockScroll = () => {
    if (!lockedStylesRef.current) return;

    document.documentElement.style.overflow = lockedStylesRef.current.htmlOverflow;
    document.body.style.overflow = lockedStylesRef.current.bodyOverflow;
    document.body.style.touchAction = lockedStylesRef.current.bodyTouchAction;
    lockedStylesRef.current = null;

    lenis?.start?.();
  };

  useEffect(
    () => () => {
      unlockScroll();
    },
    [],
  );

  const aspectRatio = useMemo(() => getAspectRatio(medium), [medium]);

  if (!mounted || (!hasOpened && !showFullscreen)) return null;

  const container = document.getElementById("hover-preview");
  if (!container) return null;

  const safeAspectRatio = Math.max(0.2, Math.min(aspectRatio || 1, 5));
  const widthByHeight = `calc((100dvh - (var(--margin) * 2)) * ${safeAspectRatio})`;
  const keepBackdropVisible = showFullscreen || (hasOpened && !isBackdropResolving);

  return createPortal(
    <>
      <FlipPresenceTwo
        motionKey="fullscreen-media"
        isVisible={showFullscreen}
        onExitComplete={() => {
          unlockScroll();
          setIsBackdropResolving(true);
        }}
      >
        <div
          onClick={() => setShowFullscreen(false)}
          style={{
            position: "relative",
            width: "100vw",
            height: "100dvh",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
            <Media medium={medium} copyright={copyright} isActive={true} objectFit="contain" />
          </div>
        </div>
      </FlipPresenceTwo>

      <div
        onClick={() => setShowFullscreen(false)}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100dvh",
          minHeight: "100vh",
          zIndex: 10,
          backdropFilter: keepBackdropVisible ? "blur(20px)" : "blur(0px)",
          WebkitBackdropFilter: keepBackdropVisible ? "blur(20px)" : "blur(0px)",
          opacity: keepBackdropVisible ? 1 : 0,
          pointerEvents: showFullscreen ? "all" : "none",
          transition: "backdrop-filter 1s ease, opacity 0.3s ease",
        }}
        onTransitionEnd={(event) => {
          if (event.propertyName !== "opacity") return;
          if (keepBackdropVisible) return;

          setHasOpened(false);
          setIsBackdropResolving(false);
        }}
      />
    </>,
    container,
  );
};

export default FullscreenPreview;
