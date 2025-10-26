import { downloadEvent } from "@/helpers/downloadEvent";
import DownloadButton from "@/components/Calendar/Event/DownloadButton";
import Label from "@/components/Label";

import { translate } from "@/helpers/translate";

import styles from "../Calendar.module.css";

const Location = ({ event }) => {
  const isUpcomingOrCurrent = !event.endDate || new Date(event.endDate) >= new Date();

  const Museum = ({ event }) => {
    return event.location.url ? (
      <a href={event.location.url} target="_blank">
        {translate(event.location.museum)} <span style={{ position: "relative", top: "1px" }}>{"\u25B7"}</span>
      </a>
    ) : (
      <span>{translate(event.location.museum)}</span>
    );
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", zIndex: 2 }}>
      <div>
        <Museum event={event} />
        {", "}
        {translate(event.location.city)}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {event.highlight?.pinned && <Label className={styles.notice}>P.IN.N.ED</Label>}
        {isUpcomingOrCurrent && (
          <span className={styles.icon}>
            <DownloadButton onClick={() => downloadEvent(event)} />
          </span>
        )}
      </div>
    </div>
  );
};

export default Location;
