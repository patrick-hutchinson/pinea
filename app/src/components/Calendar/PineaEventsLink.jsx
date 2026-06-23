import AnimationLink from "../Animation/AnimationLink";

import styles from "./Calendar.module.css";

const PineaEventsLink = () => {
  return (
    <AnimationLink path="/pinea-events" className={styles.pineaEventsLink} typo="h3">
      See our Past P.IN.E.A Events
    </AnimationLink>
  );
};

export default PineaEventsLink;
