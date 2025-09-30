import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import Media from "@/components/Media";
import Text from "@/components/Text";

import FormatDate from "@/components/FormatDate";
import Notice from "@/components/Notice";

const OpenCall = ({ openCall }) => {
  const [showMedia, setShowMedia] = useState(false);

  const cursor = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  const container = useRef(null);
  const preview = useRef(null);

  useEffect(() => {
    const handleScroll = (e) => {
      scroll.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update MediaPreview Position every frame
  useEffect(() => {
    let animationFrame;

    const tick = () => {
      updatePosition();
      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const updatePosition = () => {
    if (preview.current) {
      const previewRect = preview.current.getBoundingClientRect();
      const previewDimensions = { width: previewRect.width, height: previewRect.height };

      let x = cursor.current.x - previewDimensions.width / 2;
      let y = cursor.current.y - previewDimensions.height / 2;

      preview.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  const handleMouseMove = (e) => {
    cursor.current = { x: e.clientX, y: e.clientY };
  };

  const toggleMedia = (state) => {
    setShowMedia(state);
    requestAnimationFrame(updatePosition);
  };

  const handleMouseEnter = (e) => {
    cursor.current = { x: e.clientX, y: e.clientY }; // <-- capture on enter
    toggleMedia(true);
    requestAnimationFrame(updatePosition);
  };

  const handleMouseLeave = (e) => {
    setShowMedia(false);
    requestAnimationFrame(updatePosition);
  };

  const MediaPreview = () => {
    return createPortal(
      <div
        ref={preview}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          transform: "translate(0, 0)",
          pointerEvents: "none",
          width: "20vw",
          height: "500px",
          zIndex: "10",
        }}
      >
        <Media medium={openCall.thumbnail} enableFullscreen={false} />
      </div>,
      document.getElementById("hover-preview")
    );
  };

  return (
    <li
      ref={container}
      style={{ borderTop: "1px solid #000", padding: "10px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        <Notice>
          <FormatDate date={openCall.date} options={{ month: "short", day: "numeric" }} />
        </Notice>
        <h2 style={{ textTransform: "uppercase" }}>{openCall.title}</h2>
      </div>
      <h2>
        <Text text={openCall.description} />
      </h2>

      {showMedia && <MediaPreview />}
    </li>
  );
};

export default OpenCall;
