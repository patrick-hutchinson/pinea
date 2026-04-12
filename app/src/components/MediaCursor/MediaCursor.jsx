import { useEffect, useContext, useRef, forwardRef, useImperativeHandle, useState } from "react";
import { createPortal } from "react-dom";

import { motion, AnimatePresence } from "framer-motion";

import Media from "@/components/Media/Media";

import { StateContext } from "@/context/StateContext";

const MediaCursor = forwardRef(({ medium, showMedia, dimensions, label }, ref) => {
  const { isMobile } = useContext(StateContext);

  const preview = useRef(null);
  const cursor = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const [viewportMargin, setViewportMargin] = useState(0);

  const [mounted, setMounted] = useState(false);

  // Track the scroll
  useEffect(() => {
    const handleScroll = (e) => {
      scroll.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => setMounted(true), []);

  // 👇 expose child functions to parent
  useImperativeHandle(ref, () => ({
    handleMouseMove,
    handleMouseEnter,
  }));

  const handleMouseMove = (e) => {
    cursor.current = { x: e.clientX, y: e.clientY };
    requestAnimationFrame(updatePosition);
  };

  const handleMouseEnter = (e) => {
    cursor.current = { x: e.clientX, y: e.clientY };
    requestAnimationFrame(updatePosition);
  };

  const updatePosition = () => {
    if (!preview.current) {
      requestAnimationFrame(updatePosition); // try again next frame
      return;
    }
    const { width, height } = preview.current.getBoundingClientRect();
    const desiredX = cursor.current.x - width / 2;
    const desiredY = cursor.current.y - height / 2;
    const minX = viewportMargin;
    const minY = viewportMargin;
    const maxX = window.innerWidth - width - viewportMargin;
    const maxY = window.innerHeight - height - viewportMargin;
    const x = Math.min(maxX, Math.max(minX, desiredX));
    const y = Math.min(maxY, Math.max(minY, desiredY));
    preview.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  useEffect(() => {
    if (!mounted) return;

    const updateViewportMargin = () => {
      const rawMargin = getComputedStyle(document.documentElement).getPropertyValue("--margin").trim();
      const parsedMargin = Number.parseFloat(rawMargin);
      setViewportMargin(Number.isFinite(parsedMargin) ? parsedMargin : 0);
    };

    updateViewportMargin();
    window.addEventListener("resize", updateViewportMargin);

    return () => {
      window.removeEventListener("resize", updateViewportMargin);
    };
  }, [mounted]);

  useEffect(() => {
    // Center the cursor on mount
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    cursor.current = { x: centerX, y: centerY };
    requestAnimationFrame(updatePosition);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !showMedia) return;

    // Restore previous mouse position
    if (cursor.current?.x && cursor.current?.y) {
      requestAnimationFrame(updatePosition);
    } else {
      // Or center if we don't have a cursor
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      cursor.current = { x: centerX, y: centerY };
      requestAnimationFrame(updatePosition);
    }
  }, [showMedia, mounted, viewportMargin]);

  if (!mounted) return;
  if (isMobile) return;
  if (!showMedia) return;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={medium}
        ref={preview}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          pointerEvents: "none",
          zIndex: 10,
          cursor: !isMobile ? "none" : "default",
        }}
      >
        <div
          style={{
            width: "16.67px",
            height: "20px",
            flexShrink: 0,
          }}
        >
          <Media medium={medium} enableFullscreen={false} dimensions={dimensions} skipPlaceholder={true} />
        </div>
        {label && (
          <span
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        )}
      </motion.div>
    </AnimatePresence>,
    document.getElementById("hover-preview"),
  );
});

export default MediaCursor;
