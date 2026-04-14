import { translate } from "@/helpers/translate";

import Dates from "../Calendar/Event/Dates";

import styles from "./People.module.css";

const CurrentEvent = ({ event }) => {
  const endTime = new Date(event?.endDate).getTime();
  const isPastEvent = Number.isFinite(endTime) && endTime < Date.now();

  const Wrapper = isPastEvent ? "div" : "a";
  const wrapperProps = isPastEvent ? {} : { href: `/calendar#${event._id}` };

  return (
    <Wrapper {...wrapperProps} className={styles.current_event} typo="h4">
      <span className={styles.event_title}>{translate(event.title)}</span>
      <Dates event={event} />
      <span>{translate(event.location?.museum)}</span>
    </Wrapper>
  );
};

export default CurrentEvent;
