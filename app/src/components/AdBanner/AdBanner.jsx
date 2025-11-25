import Media from "@/components/Media/Media";
import { useState, useEffect, useRef } from "react";

const IMAGE_DURATION = 7000; // 7 seconds

const AdBanner = ({ media }) => {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  const getDuration = (item) => {
    const m = item.medium;

    // ➡️ If it's a video and has duration → use it
    if (item.medium.type === "video" && item.medium.duration) {
      return Math.ceil(m.duration * 1000); // sec → ms, round up
    }

    // ➡️ Otherwise → default image timeout
    return IMAGE_DURATION;
  };

  useEffect(() => {
    if (!media || media.length <= 1) return;

    const currentItem = media[index];
    const timeout = getDuration(currentItem);

    // Set next rotation
    timer.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % media.length);
    }, timeout);

    return () => clearTimeout(timer.current);
  }, [index, media]);

  return (
    <div
      style={{
        maxWidth: "720px",
        width: "calc(100% - 2 * var(--margin))",
        height: "auto",
        padding: "0 var(--margin)",
        maxHeight: "90px",
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
      }}
    >
      <Media medium={media[index].medium} />
    </div>
  );
};

export default AdBanner;
