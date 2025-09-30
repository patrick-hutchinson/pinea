import CalendarEvent from "./CalendarEvent";
import styles from "./Calendar.module.css";

const Calendar = ({ events }) => {
  return (
    <div className={styles.calendar}>
      <div className={`${styles.row} ${styles.head}`}>
        <h4 className={styles.cell}>TITLE</h4>
        <h4 className={styles.cell}>TIME</h4>
        <h4 className={styles.cell}>LOCATION</h4>
      </div>

      <ul className={styles.body}>
        {events.map((event, index) => {
          return <CalendarEvent key={index} event={event} />;
        })}
      </ul>
    </div>
  );
};

export default Calendar;
