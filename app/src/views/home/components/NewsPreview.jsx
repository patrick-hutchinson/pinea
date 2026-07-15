import { useContext, useMemo } from "react";

import Bulletin from "@/components/Bulletin/Bulletin";
import FormatDate from "@/components/FormatDate/FormatDate";

import { LanguageContext } from "@/context/LanguageContext";

import styles from "../HomePage.module.css";

const NewsPreview = ({ news }) => {
  const { language } = useContext(LanguageContext);

  const translateByLanguage = (value) => {
    if (typeof value === "string") return value;
    if (!Array.isArray(value)) return "";

    const translation = value.find((item) => item?._key === language) || value.find((item) => item?._key === "en") || value[0];
    return translation?.value || "";
  };

  const featuredNews = useMemo(() => {
    const sorted = [...(news || [])].sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    return sorted.slice(0, 2);
  }, [news]);

  return (
    <ul className={styles.open_calls_wrapper}>
      {featuredNews.map((news) => {
        return (
          <Bulletin
            key={news?._id || news?.slug?.current || news?.deadline}
            link={`/news#${news.slug?.current}`}
            openCall={news}
            title={translateByLanguage(news.title)}
            text={translateByLanguage(news.teaser)}
            label={<FormatDate date={news.deadline} format={{ month: "short", day: "numeric" }} />}
            isMembersOnly={Boolean(news?.membersOnlyContent)}
            isMembersOnlyLocked={Boolean(news?.isMembersOnlyLocked)}
          />
        );
      })}
    </ul>
  );
};

export default NewsPreview;
