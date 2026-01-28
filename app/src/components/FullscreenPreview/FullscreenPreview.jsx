import { useState, useEffect, useContext } from "react";

import { createPortal } from "react-dom";
import FlipPresenceTwo from "../Animation/FlipPresence/FlipPresenceTwo";
import Media from "../Media/Media";

import { DimensionsContext } from "@/context/DimensionsContext";

const FullscreenPreview = ({ showFullscreen, setShowFullscreen, medium, copyright }) => {
  const { deviceDimensions } = useContext(DimensionsContext);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true); // now document exists
  }, []);

  if (!mounted) return null;

  const container = document.getElementById("hover-preview");
  if (!container) return null; // fallback if container not in DOM

  const aspectRatio = medium.width / medium.height;

  const maxImageWidth = deviceDimensions.width * 0.8;
  const maxImageHeight = deviceDimensions.height * 0.8;

  let imageWidth, imageHeight;

  let wFromWidth = maxImageWidth;
  let hFromWidth = maxImageWidth / aspectRatio;

  let hFromHeight = maxImageHeight;
  let wFromHeight = maxImageHeight * aspectRatio;

  if (hFromWidth <= maxImageHeight) {
    imageWidth = `${wFromWidth}px`;
    imageHeight = `${hFromWidth}px`;
  } else {
    imageWidth = `${wFromHeight}px`;
    imageHeight = `${hFromHeight}px`;
  }
  return createPortal(
    <>
      <FlipPresenceTwo motionKey={showFullscreen ? "animate" : "exit"}>
        <div
          onClick={() => setShowFullscreen(false)}
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: maxImageHeight,
              maxWidth: maxImageWidth,
              width: imageWidth,
              height: imageHeight,
            }}
          >
            <Media medium={medium} copyright={copyright} isActive={true} />
          </div>
        </div>
      </FlipPresenceTwo>

      <div
        onClick={() => setShowFullscreen(false)}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 99,
          top: 0,
          left: 0,
          backdropFilter: showFullscreen ? "blur(20px)" : "blur(0px)",
          opacity: showFullscreen ? 1 : 0,
          transition: "backdrop-filter 1s ease, opacity 0.3s ease",
        }}
      />
    </>,
    container,
  );
};

export default FullscreenPreview;
