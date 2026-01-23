import { translate } from "@/helpers/translate";

import Dates from "../Calendar/Event/Dates";

import styles from "./People.module.css";

const CurrentEvent = ({ event }) => {
  console.log(`/calendar#${event._id}`);
  return (
    <a href={`/calendar#${event._id}`} className={styles.current_event} typo="h4">
      <span className={styles.event_title}>{translate(event.title)}</span>, <Dates event={event} />
      <span>{translate(event.location.museum)}</span>
    </a>
  );
};

export default CurrentEvent;
