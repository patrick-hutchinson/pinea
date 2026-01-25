import FormatDate from "@/components/FormatDate/FormatDate";

import Text from "@/components/Text/Text";
import AnimationLink from "@/components/Animation/AnimationLink";

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

  function portableTextToPlainText(blocks = []) {
    return blocks
      .map((block) => {
        if (block._type !== "block" || !block.children) return "";
        return block.children.map((child) => child.text).join("");
      })
      .join("\n\n");
  }

  return (
    <ul typo="h4" className={styles.articles_container}>
      <PlainHead className={styles.article_head}>STORIES</PlainHead>

      <div className={styles.articles}>
        {contributor.articles?.map((article) => {
          console.log("NAME:", article.name);
          console.log("TEASER:", article.teaser);

          const translatedTeaser = translate(article.teaser);
          const articleTitle =
            article.category !== "portfolios" ? (
              <Text text={translate(article.title)} className={styles.article_title} />
            ) : (
              <div className={styles.article_title}>
                {`${article.name}: ${portableTextToPlainText(translatedTeaser)}`}
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

              <AnimationLink path={`/stories/${article.category}/${article.slug.current}`}>
                {articleTitle}
              </AnimationLink>
            </div>
          );
        })}
      </div>
    </ul>
  );
};

export default ArticleLinks;
