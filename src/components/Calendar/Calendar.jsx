import CalendarEvent from "./CalendarEvent";
import styles from "./Calendar.module.css";

const Calendar = ({ events }) => {
  return (
    <div className={styles.calendar}>
      <div className={`${styles.row} ${styles.head}`}>
        <h5 className={styles.cell}>TITLE</h5>
        <h5 className={styles.cell}>TIME</h5>
        <h5 className={styles.cell}>LOCATION</h5>
      </div>

      <ul className={`${styles.body} ff4`}>
        {events.map((event, index) => {
          return <CalendarEvent key={index} event={event} />;
        })}
      </ul>
    </div>
  );
};

export default Calendar;
