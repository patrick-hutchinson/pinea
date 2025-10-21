import styles from "../Calendar.module.css";
import { translate } from "@/helpers/translate";

const Title = ({ event }) => {
  return (
    <div>
      <span className={styles.title}>{translate(event.title)}</span>,{" "}
      <i className={styles.type}>{translate(event.type.title)}</i>
    </div>
  );
};

export default Title;
