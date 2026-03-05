import { useState, useEffect, useContext } from "react";

import Link from "next/link";
import Bulletin from "@/components/Bulletin/Bulletin";
import FormatDate from "@/components/FormatDate/FormatDate";

import { LanguageContext } from "@/context/LanguageContext";

import styles from "../HomePage.module.css";

const NewsPreview = ({ news }) => {
  const [shuffledNews, setShuffledNews] = useState([]);
  const { language } = useContext(LanguageContext);

  const translateByLanguage = (value) => {
    if (typeof value === "string") return value;
    if (!Array.isArray(value)) return "";

    const translation = value.find((item) => item?._key === language) || value.find((item) => item?._key === "en") || value[0];
    return translation?.value || "";
  };

  useEffect(() => {
    const sorted = [...news].sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    setShuffledNews(sorted.slice(0, 2));
  }, [news]);

  return (
    <ul className={styles.open_calls_wrapper}>
      {shuffledNews.map((news, index) => {
        return (
          <Bulletin
              key={index}
              link={`/news#${news.slug?.current}`}
              openCall={news}
              title={translateByLanguage(news.title)}
              text={translateByLanguage(news.teaser)}
              label={<FormatDate date={news.deadline} format={{ month: "short", day: "numeric" }} />}
            />
          );
      })}
    </ul>
  );
};

export default NewsPreview;
