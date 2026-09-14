import { forwardRef } from "react";
import { translate } from "@/helpers/translate";

import Dates from "../Calendar/Event/Dates";

import styles from "./People.module.css";
import { isEventCurrent } from "@/helpers/Calendar/eventTiming";

const CurrentEvent = forwardRef(({ event }, ref) => {
  const isPastEvent = !isEventCurrent(event);

  const Wrapper = isPastEvent ? "div" : "a";
  const wrapperProps = isPastEvent ? {} : { href: `/calendar#${event._id}` };

  return (
    <Wrapper
      {...wrapperProps}
      ref={ref}
      className={`${styles.current_event} ${isPastEvent ? styles.expiredCurrentEvent : ""}`}
      typo="h4"
    >
      <span className={styles.event_title}>{translate(event.title)}</span>
      <Dates event={event} />
      <span>{translate(event.location?.museum)}</span>
    </Wrapper>
  );
});

CurrentEvent.displayName = "CurrentEvent";

export default CurrentEvent;
