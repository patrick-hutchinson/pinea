import { downloadEvent } from "@/helpers/downloadEvent";
import DownloadButton from "@/components/Calendar/Event/DownloadButton";
import Label from "@/components/Label";

import { translate } from "@/helpers/translate";

import styles from "../Calendar.module.css";

const Location = ({ event }) => {
  const isUpcomingOrCurrent = !event.endDate || new Date(event.endDate) >= new Date();

  return (
    <div style={{ display: "flex", justifyContent: "space-between", zIndex: 2 }}>
      <div>{`${translate(event.location.museum)}, ${translate(event.location.city)} (${
        event.location.country.cca2
      })`}</div>

      {/* {event.highlight?.hosted && <Label className={styles.notice}>HOSTED</Label>} */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {event.highlight?.pinned && <Label className={styles.notice}>P.IN.N.ED</Label>}
        {isUpcomingOrCurrent && <DownloadButton onClick={() => downloadEvent(event)} />}
      </div>
    </div>
  );
};

export default Location;
