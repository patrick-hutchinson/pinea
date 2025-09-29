import { useRef, useEffect } from "react";

import Media from "@/components/Media";
import Text from "@/components/Text";

const OpenCall = ({ openCall }) => {
  const date = new Date(openCall.date);

  const options = { month: "short", day: "numeric" };
  const formatted = date.toLocaleDateString("en-US", options).toUpperCase();

  const mediaRef = useRef({});

  const previewWrapperRef = useRef(null);
  const cursorRef = useRef({ x: 0, y: 0 });
  const scrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = (e) => {
      scrollYRef.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update ImagePreview Position every frame
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
    if (previewWrapperRef.current) {
      const imageWidth = previewWrapperRef.current.getBoundingClientRect().width;
      const imageHeight = previewWrapperRef.current.getBoundingClientRect().height;

      let x = cursorRef.current.x - imageWidth / 2;
      let y = cursorRef.current.y + scrollYRef.current - imageHeight / 2 - window.innerHeight;

      previewWrapperRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  const handleMouseMove = (e) => {
    cursorRef.current = { x: e.clientX, y: e.clientY };
  };

  const showMedia = () => {
    mediaRef.current.style.visibility = "visible";
    requestAnimationFrame(updatePosition);
  };

  const hideMedia = () => {
    console.log("hidemedia");
    mediaRef.current.style.visibility = "hidden";
    requestAnimationFrame(updatePosition);
  };

  const ImagePreview = () => {
    return (
      <div
        ref={previewWrapperRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translate(0, 0)",
          pointerEvents: "none",
          width: "20vw",
          height: "500px",
        }}
      >
        <div
          ref={mediaRef}
          style={{
            visibility: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            width: "20vw",
            height: "500px",
          }}
        >
          <Media medium={openCall.thumbnail} enableFullscreen={false} />
        </div>
      </div>
    );
  };

  return (
    <li
      style={{ borderTop: "1px solid #000", paddingTop: "10px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => showMedia()}
      onMouseLeave={() => hideMedia()}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        <h4
          style={{
            background: "var(--foreground)",
            color: "var(--background)",
            display: "inline-block",
            padding: "4px 12px",
            height: "fit-content",
          }}
        >
          {formatted}
        </h4>
        <h2 style={{ textTransform: "uppercase" }}>{openCall.title}</h2>
      </div>
      <h2>
        <Text text={openCall.description} />
      </h2>

      <ImagePreview />
    </li>
  );
};

export default OpenCall;
