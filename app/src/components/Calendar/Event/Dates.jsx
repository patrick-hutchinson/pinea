import styles from "../Calendar.module.css";
import FormatDate from "@/components/FormatDate/FormatDate";

const Dates = ({ event }) => {
  const dateFormat = { day: "2-digit", month: "2-digit", year: "numeric" };

  return (
    <div>
      <FormatDate date={event.startDate} format={dateFormat} className={styles.startDate} />
      <span className={styles.dash}>–</span>
      <FormatDate date={event.endDate} format={dateFormat} className={styles.endDate} />
    </div>
  );
};

export default Dates;
