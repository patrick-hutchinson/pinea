import { useRef, useContext, useEffect, useState, useImperativeHandle } from "react";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import { StateContext } from "@/context/StateContext";

import Media from "@/components/Media/Media";

const ImagePreview = ({ medium, hovering }) => {
  const { isTouch } = useContext(StateContext);

  const [portal, setPortal] = useState(null);
  const [mounted, setMounted] = useState(false);

  const imageRef = useRef(null);
  const cursor = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => setMounted(true), []);

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

  useEffect(() => {
    if (!hovering) return;

    const onMove = (e) => {
      cursor.current = { x: e.clientX, y: e.clientY };
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, [hovering]);

  const updatePosition = () => {
    if (!imageRef.current) {
      requestAnimationFrame(updatePosition); // try again next frame
      return;
    }
    const { width, height } = imageRef.current.getBoundingClientRect();
    const x = cursor.current.x - 30;
    const y = cursor.current.y - 30;
    imageRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = document.getElementById("hover-preview");
    if (el) setPortal(el);
  }, []);

  if (!mounted || !portal || !hovering || !medium || isTouch) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        key={medium?._id}
        ref={imageRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 50,
          left: 50,
          width: "10vw",
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
