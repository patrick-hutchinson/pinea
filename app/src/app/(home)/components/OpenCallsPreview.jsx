import { useContext, useMemo } from "react";

import Bulletin from "@/components/Bulletin/Bulletin";
import FormatDate from "@/components/FormatDate/FormatDate";

import { LanguageContext } from "@/context/LanguageContext";

import styles from "../HomePage.module.css";

const OpenCallsPreview = ({ openCalls }) => {
  const { language } = useContext(LanguageContext);

  const translateByLanguage = (value) => {
    if (typeof value === "string") return value;
    if (!Array.isArray(value)) return "";

    const translation = value.find((item) => item?._key === language) || value.find((item) => item?._key === "en") || value[0];
    return translation?.value || "";
  };

  const featuredOpenCalls = useMemo(() => {
    const now = new Date();

    const upcomingOpenCalls = (openCalls || []).filter((openCall) => {
      if (!openCall.deadline) return false; // or true, depending on your rules
      return new Date(openCall.deadline) >= now;
    });

    return [...upcomingOpenCalls]
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 2);
  }, [openCalls]);

  return (
    <ul className={styles.open_calls_wrapper}>
      {featuredOpenCalls.map((openCall) => {
        return (
          <Bulletin
            key={openCall?._id || openCall?.slug?.current || openCall?.deadline}
            openCall={openCall}
            title={translateByLanguage(openCall.title)}
            text={translateByLanguage(openCall.teaser)}
            label={<FormatDate date={openCall.deadline} format={{ month: "short", day: "numeric" }} />}
            link={`/open-calls#${openCall.slug.current}`}
            isMembersOnly={Boolean(openCall?.membersOnlyContent)}
            isMembersOnlyLocked={Boolean(openCall?.isMembersOnlyLocked)}
            membersOnlyLabel="Ⓜ"
          />
        );
      })}
    </ul>
  );
};

export default OpenCallsPreview;
