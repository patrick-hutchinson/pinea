import { useState, useEffect } from "react";

import Bulletin from "@/components/Bulletin/Bulletin";
import FormatDate from "@/components/FormatDate/FormatDate";

import { translate } from "@/helpers/translate";

import styles from "../HomePage.module.css";

const OpenCallsPreview = ({ openCalls }) => {
  const [shuffledOpenCalls, setShuffledOpenCalls] = useState([]);

  useEffect(() => {
    const now = new Date();

    const upcomingOpenCalls = openCalls.filter((openCall) => {
      if (!openCall.deadline) return false; // or true, depending on your rules
      return new Date(openCall.deadline) >= now;
    });

    const randomTwo = [...upcomingOpenCalls].sort(() => 0.5 - Math.random()).slice(0, 2);

    setShuffledOpenCalls(randomTwo);
  }, [openCalls]);

  return (
    <ul className={styles.open_calls_wrapper}>
      {shuffledOpenCalls.map((openCall, index) => {
        return (
          <Bulletin
            key={index}
            openCall={openCall}
            title={translate(openCall.title)}
            text={translate(openCall.teaser)}
            label={<FormatDate date={openCall.deadline} format={{ month: "short", day: "numeric" }} />}
            link={`/open-calls#${openCall.slug.current}`}
          />
        );
      })}
    </ul>
  );
};

export default OpenCallsPreview;
