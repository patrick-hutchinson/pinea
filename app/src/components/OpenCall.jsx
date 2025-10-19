import { useState, useRef } from "react";

import Label from "@/components/Label";
import FormatDate from "@/components/FormatDate";
import Text from "@/components/Text";

import MediaCursor from "./MediaCursor";

const OpenCall = ({ openCall }) => {
  const [showMedia, setShowMedia] = useState(false);
  const mediaRef = useRef(null);

  return (
    <li
      style={{ borderTop: "1px solid #000", padding: "var(--margin) 0", paddingBottom: "calc(var(--margin) * 3)" }}
      onMouseEnter={(e) => {
        mediaRef.current?.handleMouseEnter(e);
        setShowMedia(true);
      }}
      onMouseMove={(e) => mediaRef.current?.handleMouseMove(e)}
      onMouseLeave={(e) => setShowMedia(false)}
    >
      <div style={{ display: "flex", gap: "var(--margin)" }}>
        <Label>
          <FormatDate date={openCall.date} format={{ month: "short", day: "numeric" }} />
        </Label>
        <h2 style={{ textTransform: "uppercase" }}>{openCall.title}</h2>
      </div>
      <h2>
        <Text text={openCall.description} />
      </h2>

      <MediaCursor ref={mediaRef} medium={openCall.thumbnail} showMedia={showMedia} />
    </li>
  );
};

export default OpenCall;
