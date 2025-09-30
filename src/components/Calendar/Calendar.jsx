import CalendarEvent from "./CalendarEvent";
import styles from "./Calendar.module.css";

import FormatDate from "@/components/FormatDate";

const Calendar = ({ events }) => {
  return (
    <ul className={styles.calendar}>
      <div className={`${styles.row} ${styles.head}`}>
        <h4 className={styles.cell}>TITLE</h4>
        <div className={styles.line}></div>
        <h4 className={styles.cell}>TIME</h4>
        <div className={styles.line}></div>
        <h4 className={styles.cell}>LOCATION</h4>
      </div>
      {events.map((event, index) => {
        return <CalendarEvent key={index} event={event} />;
      })}
    </ul>
  );
};

// const CalendarCols = () => (
//   <colgroup>
//     <col style={{ width: "40%" }} />
//     <col style={{ width: "35%" }} />
//     <col style={{ width: "25%" }} />
//   </colgroup>
// );

// const Calendar = ({ events }) => {
//   return (
//     <div className={styles.calendar}>
//       <table className={styles.thead}>
//         <CalendarCols />
//         <thead>
//           <tr>
//             <th>Event</th>
//             <th>Location</th>
//             <th>Time</th>
//           </tr>
//         </thead>
//       </table>
//       <table className={styles.tbody}>
//         <CalendarCols />
//         <tbody>
//           {events.map((event, i) => (
//             <tr key={i}>
//               <td>
//                 <span className={styles.artist}>{event.artist}</span>, {event.title}
//               </td>
//               <td>{`${event.museum}, ${event.city} (${event.country})`}</td>
//               <td>
//                 <FormatDate date={event.startDate} />—<FormatDate date={event.endDate} />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

export default Calendar;
