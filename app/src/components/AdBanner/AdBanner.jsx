import Media from "@/components/Media/Media";
import { useState, useEffect, useRef, useContext } from "react";

import { StateContext } from "@/context/StateContext";

const IMAGE_DURATION = 8000; // 8 seconds

const AdBanner = ({ mediaDesktop, mediaMobile }) => {
  const { isMobile } = useContext(StateContext);

  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  const getDuration = (item) => {
    const m = item.medium;

    // ➡️ If it's a video and has duration → use it
    if (item.medium.type === "video" && item.medium.duration) {
      return Math.ceil(m.duration * 1000 + 1000); // sec → ms, round up and add a second buffer
    }

    // ➡️ Otherwise → default image timeout
    return IMAGE_DURATION;
  };

  useEffect(() => {
    if (!mediaDesktop || mediaDesktop.length <= 1) return;

    const currentItem = mediaDesktop[index];
    const timeout = getDuration(currentItem);

    // Set next rotation
    timer.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % mediaDesktop.length);
    }, timeout);

    return () => clearTimeout(timer.current);
  }, [index, mediaDesktop]);

  const DesktopBanner = () => {
    return (
      <div
        style={{
          maxWidth: "720px",
          width: "calc(100% - 2 * var(--margin))",
          height: "auto",
          maxHeight: "90px",
          aspectRatio: "720 / 90",
          // background: "#F60AFF",
          background: "#000000",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: "50%",
          position: "relative",
          transform: "translateX(-50%)",
          marginBottom: "130px",
          overflow: "hidden",
        }}
      >
        <Media medium={mediaDesktop[index].medium} />
      </div>
    );
  };

  const MobileBanner = () => {
    return (
      <div
        style={{
          maxWidth: "320px",
          width: "calc(100% - 2 * var(--margin))",
          height: "auto",
          maxHeight: "50px",
          aspectRatio: "320 / 50",
          // background: "#F60AFF",
          background: "#000000",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: "50%",
          position: "relative",
          transform: "translateX(-50%)",
          marginBottom: "130px",
          overflow: "hidden",
        }}
      >
        <Media medium={mediaMobile[index].medium} />
      </div>
    );
  };

  return isMobile ? <MobileBanner /> : <DesktopBanner />;
};

export default AdBanner;
