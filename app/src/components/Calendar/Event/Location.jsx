import { downloadEvent } from "@/helpers/downloadEvent";

import Label from "@/components/Label/Label";

import { handleShare } from "@/helpers/shareEvent";

import { motion } from "framer-motion";

import { translate } from "@/helpers/translate";

import styles from "../Calendar.module.css";
import Icon from "@/components/Icon/Icon";
import { useContext } from "react";
import { StateContext } from "@/context/StateContext";

const Location = ({ event }) => {
  const { isMobile } = useContext(StateContext);
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

  const translatedTitle = translate(event.title); // <-- inside component body
  const translatedArtist = translate(event.artist); // <-- inside component body

  return (
    <div style={{ display: "flex", justifyContent: "space-between", zIndex: 2 }} className={styles.location}>
      <div>
        <Museum event={event} />
        {", "}
        {translate(event.location.city)}
        <span style={{ position: "relative", top: "1px" }}></span>
      </div>

      {!isMobile && (
        <motion.div style={{ display: "flex", gap: "3px" }} layout>
          {/* {event.highlight?.pinned && <Label className={styles.notice}>P.IN.N.ED</Label>} */}
          {isUpcomingOrCurrent && (
            <span className={styles.icon}>
              <Icon
                path="icons/add-button.svg"
                className={styles.addToCalendar}
                onClick={() => downloadEvent(event, translatedArtist, translatedTitle)}
              />
            </span>
          )}

          <span className={styles.icon}>
            <Icon path="icons/share.svg" onClick={() => handleShare()} />
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default Location;
