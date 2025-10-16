import { useEffect, useContext, useRef, forwardRef, useImperativeHandle, useState } from "react";
import { createPortal } from "react-dom";

import { motion, AnimatePresence } from "framer-motion";

import Media from "@/components/Media";

import { StateContext } from "../context/StateContext";

const MediaCursor = forwardRef(({ medium, showMedia, dimensions }, ref) => {
  const { isMobile } = useContext(StateContext);
  const preview = useRef(null);
  const cursor = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

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
    console.log("mousemove");
    cursor.current = { x: e.clientX, y: e.clientY };
    requestAnimationFrame(updatePosition);
  };

  const handleMouseEnter = (e) => {
    console.log("mouseenter");
    cursor.current = { x: e.clientX, y: e.clientY };
    requestAnimationFrame(updatePosition);
  };

  const updatePosition = () => {
    if (!preview.current) {
      requestAnimationFrame(updatePosition); // try again next frame
      return;
    }
    const { width, height } = preview.current.getBoundingClientRect();
    const x = cursor.current.x - width / 2;
    const y = cursor.current.y - height / 2;
    preview.current.style.transform = `translate(${x}px, ${y}px)`;
  };

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
          width: dimensions?.width ? dimensions?.width : "10vw",
          height: dimensions?.height ? dimensions?.height : "auto",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <Media medium={medium} enableFullscreen={false} dimensions={dimensions} />
      </motion.div>
    </AnimatePresence>,
    document.getElementById("hover-preview")
  );
});

export default MediaCursor;
