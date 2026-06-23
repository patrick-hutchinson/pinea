import AnimationLink from "../Animation/AnimationLink";
import { LanguageContext } from "@/context/LanguageContext";

import styles from "./Calendar.module.css";
import { useContext } from "react";

const PineaEventsLink = () => {
  const { language } = useContext(LanguageContext);

  return (
    <AnimationLink path="/pinea-events" className={styles.pineaEventsLink} typo="h3">
      {language === "en" ? "View our past P.IN.E.A Events" : "Frühere P.IN.E.A Veranstaltungen"}
    </AnimationLink>
  );
};

export default PineaEventsLink;
