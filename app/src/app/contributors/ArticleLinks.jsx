import FormatDate from "@/components/FormatDate/FormatDate";

import Text from "@/components/Text/Text";
import Link from "next/link";

import { useContext } from "react";

import { translate } from "@/helpers/translate";
import { LanguageContext } from "@/context/LanguageContext";

import { PlainHead } from "@/components/Calendar/Head";

import styles from "./ContributorsPage.module.css";

const ArticleLinks = ({ contributor, index }) => {
  const { language } = useContext(LanguageContext);

  const formatType = (str) => {
    if (!str) return "";
    return str
      .replace(/-/g, " ") // replace hyphens with spaces
      .split(" ") // split into words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1)) // capitalize first letter
      .join(" "); // join back into string
  };

  return (
    <ul typo="h4" className={styles.articles_container}>
      <PlainHead className={styles.article_head}>STORIES</PlainHead>

      <div className={styles.articles}>
        {contributor.articles?.map((article) => {
          console.log(article.category, "category");
          const articleTitle =
            article.category !== "portfolios" ? (
              <Text text={translate(article.title)} className={styles.article_title} />
            ) : (
              <div className={styles.article_title}>
                <Text text={translate(article.name)} />
                <span style={{ position: "relative", marginLeft: "-5px" }}></span>:{" "}
                <Text text={translate(article.teaser)} />
              </div>
            );
          return (
            <div className={styles.article}>
              <FormatDate
                date={article.releaseDate}
                format={{
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }}
              />
              <Text text={formatType(article.category)} className={styles.type} />

              <Link href={`/stories/${article.category}/${article.slug.current}`}>{articleTitle}</Link>
            </div>
          );
        })}
      </div>
    </ul>
  );
};

export default ArticleLinks;
