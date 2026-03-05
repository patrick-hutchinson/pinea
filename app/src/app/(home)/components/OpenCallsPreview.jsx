import { useState, useEffect, useContext } from "react";

import Bulletin from "@/components/Bulletin/Bulletin";
import FormatDate from "@/components/FormatDate/FormatDate";

import { LanguageContext } from "@/context/LanguageContext";

import styles from "../HomePage.module.css";

const OpenCallsPreview = ({ openCalls }) => {
  const [shuffledOpenCalls, setShuffledOpenCalls] = useState([]);
  const { language } = useContext(LanguageContext);

  const translateByLanguage = (value) => {
    if (typeof value === "string") return value;
    if (!Array.isArray(value)) return "";

    const translation = value.find((item) => item?._key === language) || value.find((item) => item?._key === "en") || value[0];
    return translation?.value || "";
  };

  useEffect(() => {
    const now = new Date();

    const upcomingOpenCalls = openCalls.filter((openCall) => {
      if (!openCall.deadline) return false; // or true, depending on your rules
      return new Date(openCall.deadline) >= now;
    });

    const deterministicTwo = [...upcomingOpenCalls]
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 2);

    setShuffledOpenCalls(deterministicTwo);
  }, [openCalls]);

  return (
    <ul className={styles.open_calls_wrapper}>
      {shuffledOpenCalls.map((openCall, index) => {
        return (
          <Bulletin
              key={index}
              openCall={openCall}
              title={translateByLanguage(openCall.title)}
              text={translateByLanguage(openCall.teaser)}
              label={<FormatDate date={openCall.deadline} format={{ month: "short", day: "numeric" }} />}
              link={`/open-calls#${openCall.slug.current}`}
            />
        );
      })}
    </ul>
  );
};

export default OpenCallsPreview;
