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
        <FormatDate
          date={event.startDate}
          options={{
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }}
        />
        —
        <FormatDate
          date={event.endDate}
          options={{
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }}
        />
      </Cell>
      <Cell>{`${event.museum}, ${event.city} (${event.country})`}</Cell>
    </li>
  );
};

export default CalendarEvent;
