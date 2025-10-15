import styles from "../Calendar.module.css";

const Title = ({ event }) => (
  <div>
    <span className={styles.artist}>{event.artist}</span>, <span className={styles.title}>{event.title}</span>
  </div>
);

export default Title;
