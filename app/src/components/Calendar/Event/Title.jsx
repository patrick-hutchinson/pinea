import styles from "../Calendar.module.css";

const Title = ({ event }) => {
  const artists = event.artist?.map((a) => a.name).join(", ");

  console.log(event);
  return (
    <div>
      <span className={styles.artist}>{artists}</span>, <span className={styles.title}>{event.title}</span>,{" "}
      <i className={styles.type}>{event.type.title}</i>
    </div>
  );
};

export default Title;
