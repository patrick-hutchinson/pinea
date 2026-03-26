import { useRef, useContext, useEffect, useState } from "react";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import { StateContext } from "@/context/StateContext";

import Media from "@/components/Media/Media";

const PREVIEW_OFFSET = 30;
const PREVIEW_WIDTH = 160;

const ImagePreview = ({ medium, hovering, point }) => {
  const { isTouch } = useContext(StateContext);

  const [portal, setPortal] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [hasPosition, setHasPosition] = useState(false);

  const imageRef = useRef(null);
  const cursor = useRef({ x: 0, y: 0 });
  const frameRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!hovering || isTouch) return;

    if (point?.x != null && point?.y != null) {
      cursor.current = { x: point.x, y: point.y };
      setHasPosition(true);
    }

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
  }, [hovering, point, isTouch]);

  const updatePosition = () => {
    if (!imageRef.current) return;

    const viewportWidth = window.innerWidth || 0;
    const viewportHeight = window.innerHeight || 0;
    const { width, height } = imageRef.current.getBoundingClientRect();

    const maxX = Math.max(0, viewportWidth - width - 4);
    const maxY = Math.max(0, viewportHeight - height - 4);

    const x = Math.min(maxX, Math.max(0, cursor.current.x - PREVIEW_OFFSET));
    const y = Math.min(maxY, Math.max(0, cursor.current.y - PREVIEW_OFFSET));

    imageRef.current.style.transform = `translate(${x}px, ${y}px)`;
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

  useEffect(() => {
    if (!hovering) setHasPosition(false);
  }, [hovering]);

  if (!mounted || !portal || !hovering || !medium || isTouch || !hasPosition) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        key={medium?._id || medium?.url || "archive-hover-preview"}
        ref={imageRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${PREVIEW_WIDTH}px`,
          maxWidth: "12vw",
          height: "auto",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <Media medium={medium} />
      </motion.div>
    </AnimatePresence>,
    portal,
  );
};

export default ImagePreview;
