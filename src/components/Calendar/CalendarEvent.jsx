import styles from "./Calendar.module.css";
import FormatDate from "@/components/FormatDate";

const Cell = ({ children }) => <div className={styles.cell}>{children}</div>;

const CalendarEvent = ({ event }) => {
  return (
    <li className={`${styles.row} ${styles.event}`}>
      <Cell>
        <span className={styles.artist}>{event.artist}</span>, {event.title}
      </Cell>
      <Cell>
        <FormatDate date={event.startDate} />—<FormatDate date={event.endDate} />
      </Cell>
      <Cell>{`${event.museum}, ${event.city} (${event.country})`}</Cell>
    </li>
  );
};

export default CalendarEvent;
