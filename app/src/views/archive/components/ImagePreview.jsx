import { useRef, useContext, useEffect, useMemo, useState } from "react";

import { createPortal } from "react-dom";
import { motion } from "framer-motion";

import { StateContext } from "@/context/StateContext";

const PREVIEW_OFFSET = 30;
const PREVIEW_WIDTH = 160;
const PREVIEW_MAX_HEIGHT = 150;

const getPreviewSource = (medium) => {
  if (!medium) return null;

  if (medium.type === "video" && medium.playbackId) {
    return medium.placeholderUrl || `https://image.mux.com/${medium.playbackId}/thumbnail.jpg?width=320`;
  }

  if (!medium.url) return medium.placeholderUrl || null;
  if (medium.url.startsWith("/")) return medium.url;

  try {
    const url = new URL(medium.url);
    url.searchParams.set("w", "320");
    url.searchParams.set("fit", "max");
    url.searchParams.set("auto", "format");
    return url.toString();
  } catch {
    return medium.url;
  }
};

const ImagePreview = ({ items = [], activeKey, hovering, point }) => {
  const { isTouch } = useContext(StateContext);
  const previewItems = useMemo(() => {
    const seen = new Set();

    return items.reduce((acc, item) => {
      const src = getPreviewSource(item.medium);
      if (!src || seen.has(src)) return acc;

      seen.add(src);
      acc.push({ ...item, src });
      return acc;
    }, []);
  }, [items]);

  const [portal, setPortal] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [hasPosition, setHasPosition] = useState(false);

  const imageRef = useRef(null);
  const cursor = useRef({ x: 0, y: 0 });
  const frameRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!hovering || isTouch) return;

    const onMove = (e) => {
      cursor.current = { x: e.clientX, y: e.clientY };
      setHasPosition(true);
    };

    window.addEventListener("mousemove", onMove);
    const onScroll = () => {
      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = () => {
      updatePosition();
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [hovering, isTouch]);

  const updatePosition = () => {
    if (!imageRef.current) return;

    const viewportWidth = window.innerWidth || 0;
    const viewportHeight = window.innerHeight || 0;
    const { width, height } = imageRef.current.getBoundingClientRect();

    const maxX = Math.max(0, viewportWidth - width - 4);
    const maxY = Math.max(0, viewportHeight - height - 4);

    const x = Math.min(maxX, Math.max(0, cursor.current.x - PREVIEW_OFFSET));
    const y = Math.min(maxY, Math.max(0, cursor.current.y - PREVIEW_OFFSET));

    imageRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  useEffect(() => {
    const el = document.getElementById("hover-preview");
    if (el) setPortal(el);
  }, []);

  useEffect(() => {
    if (point?.x == null || point?.y == null) return;
    cursor.current = { x: point.x, y: point.y };
    setHasPosition(true);
    if (hovering) {
      requestAnimationFrame(updatePosition);
    }
  }, [point, hovering]);

  if (!mounted || !portal || isTouch || previewItems.length === 0) return null;

  const activeItem = items.find((item) => item.key === activeKey);
  const activeSrc = getPreviewSource(activeItem?.medium);
  const activePreviewItem = previewItems.find((item) => item.src === activeSrc);
  const activeMedium = activePreviewItem?.medium;
  const isVisible = Boolean(hovering && hasPosition && activePreviewItem);

  return createPortal(
    <motion.div
      ref={imageRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: isVisible ? 0.12 : 0.2, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${PREVIEW_WIDTH}px`,
        maxWidth: "12vw",
        maxHeight: `${PREVIEW_MAX_HEIGHT}px`,
        aspectRatio: `${activeMedium?.width || PREVIEW_WIDTH} / ${activeMedium?.height || PREVIEW_MAX_HEIGHT}`,
        pointerEvents: "none",
        zIndex: 10,
        willChange: "transform, opacity",
        transform: "translate3d(0, 0, 0)",
      }}
    >
      {previewItems.map((item) => {
        return (
          <img
            key={item.src}
            src={item.src}
            alt=""
            draggable={false}
            loading="eager"
            decoding="async"
            fetchPriority="low"
            style={{
              display: "block",
              height: "100%",
              inset: 0,
              objectFit: "contain",
              opacity: item.src === activeSrc ? 1 : 0,
              position: "absolute",
              transition: "opacity 120ms ease-out",
              width: "100%",
            }}
          />
        );
      })}
    </motion.div>,
    portal,
  );
};

export default ImagePreview;
