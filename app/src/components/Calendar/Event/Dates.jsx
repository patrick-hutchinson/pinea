import styles from "../Calendar.module.css";
import FormatDate from "@/components/FormatDate";

const Dates = ({ event }) => {
  const dateFormat = { day: "2-digit", month: "2-digit", year: "numeric" };

  return (
    <div>
      <FormatDate date={event.startDate} options={dateFormat} className={styles.startDate} />
      <span className={styles.dash}>–</span>
      <FormatDate date={event.endDate} options={dateFormat} className={styles.endDate} />
    </div>
  );
};

export default Dates;
