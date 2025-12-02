import { downloadEvent } from "@/helpers/downloadEvent";
import { translate } from "@/helpers/translate";
import { handleShare } from "@/helpers/shareEvent";

import { motion } from "framer-motion";

import Icon from "@/components/Icon/Icon";

import styles from "../Calendar.module.css";

const ShareEvent = ({ event }) => {
  const isUpcomingOrCurrent = !event.endDate || new Date(event.endDate) >= new Date();

  const translatedTitle = translate(event.title); // <-- inside component body
  const translatedArtist = translate(event.artist); // <-- inside component body
  return (
    <motion.div style={{ display: "flex", gap: "3px" }} layout>
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
  );
};

export default ShareEvent;
