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
      <PlainHead className={styles.article_head}>{language === "en" ? "ARTICLES" : "ARTIKEL"}</PlainHead>

      <div className={styles.articles}>
        {contributor.articles?.map((article) => {
          const articleTitle = article.title || article.name;
          console.log(article.category, "categroy");
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

              <Link href={`/stories/${article.category}/${article.slug.current}`}>
                <Text text={translate(articleTitle)} className={styles.article_title} />
              </Link>
            </div>
          );
        })}
      </div>
    </ul>
  );
};

export default ArticleLinks;
