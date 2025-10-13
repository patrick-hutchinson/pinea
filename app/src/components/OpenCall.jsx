import { useState, useRef } from "react";

import Notice from "@/components/Notice";
import FormatDate from "@/components/FormatDate";
import Text from "@/components/Text";

import MediaPreview from "./MediaPreview";

const OpenCall = ({ openCall }) => {
  const [showMedia, setShowMedia] = useState(false);
  const mediaRef = useRef(null);

  return (
    <li
      style={{ borderTop: "1px solid #000", padding: "var(--margin)", paddingBottom: "calc(var(--margin) * 3)" }}
      onMouseEnter={(e) => {
        mediaRef.current?.handleMouseEnter(e);
        setShowMedia(true);
      }}
      onMouseMove={(e) => mediaRef.current?.handleMouseMove(e)}
      onMouseLeave={(e) => setShowMedia(false)}
    >
      <div style={{ display: "flex", gap: "var(--margin)" }}>
        <Notice>
          <FormatDate date={openCall.date} options={{ month: "short", day: "numeric" }} />
        </Notice>
        <h2 style={{ textTransform: "uppercase" }}>{openCall.title}</h2>
      </div>
      <h2>
        <Text text={openCall.description} />
      </h2>

      <MediaPreview ref={mediaRef} medium={openCall.thumbnail} showMedia={showMedia} />
    </li>
  );
};

export default OpenCall;
