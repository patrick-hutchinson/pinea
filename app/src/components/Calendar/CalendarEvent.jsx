import { useContext } from "react";
import { StateContext } from "@/context/StateContext";

import styles from "./Calendar.module.css";
import FormatDate from "@/components/FormatDate";

const CalendarEvent = ({ event }) => {
  const { isMobile } = useContext(StateContext);

  const dateFormat = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return (
    <li className={`${styles.row} ${styles.event}`}>
      <div className={`${styles.cell} ${styles.title}`}>
        <span className={styles.artist}>{event.artist}</span>, {event.title}
      </div>
      <div className={`${styles.cell} ${styles.date}`}>
        <FormatDate date={event.startDate} options={dateFormat} className={styles.startDate} />
        <span className={styles.dash}>–</span>
        <FormatDate date={event.endDate} options={dateFormat} className={styles.endDate} />
      </div>
      {!isMobile && (
        <div className={`${styles.cell} ${styles.location}`}>{`${event.museum}, ${event.city} (${event.country})`}</div>
      )}
    </li>
  );
};

export default CalendarEvent;
