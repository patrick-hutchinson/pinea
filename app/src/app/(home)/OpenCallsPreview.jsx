import { useState, useEffect } from "react";

import Link from "next/link";
import TitleBlockExpand from "@/components/TitleBlock/TitleBlockExpand";
import FormatDate from "@/components/FormatDate/FormatDate";

import { translate } from "@/helpers/translate";

import styles from "./HomePage.module.css";

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
    <Link href="/open-calls">
      <ul className={styles.open_calls_wrapper}>
        {shuffledOpenCalls.map((openCall, index) => {
          return (
            <TitleBlockExpand
              key={index}
              openCall={openCall}
              title={translate(openCall.title)}
              text={translate(openCall.teaser)}
              label={<FormatDate date={openCall.deadline} format={{ month: "short", day: "numeric" }} />}
            />
          );
        })}
      </ul>
    </Link>
  );
};

export default OpenCallsPreview;
