import { downloadEvent } from "@/helpers/downloadEvent";
import CustomIcon from "@/components/Calendar/Event/CustomIcon";
import Label from "@/components/Label";

import { motion } from "framer-motion";

import { translate } from "@/helpers/translate";

import styles from "../Calendar.module.css";

const Location = ({ event }) => {
  const isUpcomingOrCurrent = !event.endDate || new Date(event.endDate) >= new Date();

  const Museum = ({ event }) => {
    return event.location.url ? (
      <a href={event.location.url} target="_blank">
        {translate(event.location.museum)}
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
        <span style={{ position: "relative", top: "1px" }}>{"\u2192"}</span>
      </div>

      <motion.div style={{ display: "flex" }} layout>
        {event.highlight?.pinned && <Label className={styles.notice}>P.IN.N.ED</Label>}
        {isUpcomingOrCurrent && (
          <span className={styles.icon}>
            <CustomIcon onClick={() => downloadEvent(event)} preview="+" text="CALENDAR" />
          </span>
        )}

        <span className={styles.icon}>
          <CustomIcon onClick={() => downloadEvent(event)} preview="-" text="SHARE" />
        </span>
      </motion.div>
    </div>
  );
};

export default Location;
