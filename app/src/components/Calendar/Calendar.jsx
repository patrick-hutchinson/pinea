import { useContext } from "react";
import { StateContext } from "@/context/StateContext";

import CalendarEvent from "./CalendarEvent";
import styles from "./Calendar.module.css";

const Calendar = ({ events }) => {
  const { isMobile } = useContext(StateContext);

  return (
    <div className={styles.calendar}>
      <div className={`${styles.row} ${styles.head}`}>
        <h5 className={`${styles.cell} ${styles.title}`}>TITLE</h5>
        <h5 className={`${styles.cell} ${styles.time}`}>TIME</h5>
        {!isMobile && <h5 className={`${styles.cell} ${styles.location}`}>LOCATION</h5>}
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
