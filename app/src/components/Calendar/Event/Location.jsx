import { downloadEvent } from "@/helpers/downloadEvent";

import Label from "@/components/Label/Label";

import { handleShare } from "@/helpers/shareEvent";

import { motion } from "framer-motion";

import { translate } from "@/helpers/translate";

import styles from "../Calendar.module.css";
import Icon from "@/components/Icon/Icon";

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
    <div style={{ display: "flex", justifyContent: "space-between", zIndex: 2 }} className={styles.location}>
      <div>
        <Museum event={event} />
        {", "}
        {translate(event.location.city)}
        <span style={{ position: "relative", top: "1px" }}></span>
      </div>

      <motion.div style={{ display: "flex", gap: "3px" }} layout>
        {/* {event.highlight?.pinned && <Label className={styles.notice}>P.IN.N.ED</Label>} */}
        {isUpcomingOrCurrent && (
          <span className={styles.icon}>
            <Icon path="icons/add-button.svg" className={styles.addToCalendar} onClick={() => downloadEvent(event)} />
          </span>
        )}

        <span className={styles.icon}>
          <Icon path="icons/share.svg" onClick={() => handleShare()} />
        </span>
      </motion.div>
    </div>
  );
};

export default Location;
