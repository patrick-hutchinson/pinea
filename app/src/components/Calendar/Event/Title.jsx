import styles from "../Calendar.module.css";

const Title = ({ event }) => {
  return (
    <div>
      <span className={styles.title}>{event.title}</span>, <i className={styles.type}>{event.type.title}</i>
    </div>
  );
};

export default Title;
