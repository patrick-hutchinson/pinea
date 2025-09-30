import styles from "./Calendar.module.css";
import FormatDate from "@/components/FormatDate";

const CalendarEvent = ({ event }) => {
  return (
    <li className={`${styles.row} ${styles.event}`}>
      <div className={styles.cell}>
        <span className={styles.artist}>{event.artist}</span>, <span>{event.title}</span>
      </div>
      <div className={styles.line}></div>
      <div className={styles.cell}>
        <FormatDate date={event.startDate} />—<FormatDate date={event.endDate} />
      </div>
      <div className={styles.line}></div>
      <div className={styles.cell}>{`${event.museum}, ${event.city} (${event.country})`}</div>
    </li>
  );
};

export default CalendarEvent;
