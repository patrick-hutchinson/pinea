import { translate } from "@/helpers/translate";

import Dates from "../Calendar/Event/Dates";

import styles from "./People.module.css";

const CurrentEvent = ({ event }) => {
  return (
    <div className={styles.current_event} typo="h4">
      <span className={styles.event_title}>{translate(event.title)}</span>, <Dates event={event} />
      <span>
        <a href={event.location.url} target="_blank">
          {translate(event.location.museum)}
        </a>
      </span>
    </div>
  );
};

export default CurrentEvent;
