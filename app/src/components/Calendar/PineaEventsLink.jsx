import AnimationLink from "../Animation/AnimationLink";
import { LanguageContext } from "@/context/LanguageContext";

import styles from "./Calendar.module.css";
import { useContext } from "react";

const PineaEventsLink = () => {
  const { language } = useContext(LanguageContext);

  return (
    <AnimationLink path="/pinea-events" className={styles.pineaEventsLink} typo="h3">
      View past P.IN.E.A Events
    </AnimationLink>
  );
};

export default PineaEventsLink;
