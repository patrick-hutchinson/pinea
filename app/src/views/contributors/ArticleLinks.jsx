import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import FormatDate from "@/components/FormatDate/FormatDate";

import AnimationLink from "@/components/Animation/AnimationLink";

import ArticleTitle from "@/components/Articles/ArticleTitle";
import ArticleCategory from "@/components/Articles/ArticleCategory";
import Button from "@/components/Buttons/Button";

import { PlainHead } from "@/components/Calendar/Head";

import styles from "./ContributorsPage.module.css";

const INITIAL_VISIBLE_ARTICLES = 5;
const ARTICLES_PER_PAGE = 10;

const ArticleLinks = ({ contributor }) => {
  const safeArticles = (Array.isArray(contributor?.articles) ? contributor.articles : []).filter(
    (article) => article && (article.path || (article.slug?.current && article.category)),
  );
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_ARTICLES);
  const visibleArticles = safeArticles.slice(0, visibleCount);
  const hasMoreArticles = visibleCount < safeArticles.length;
  const showPaginationButton = safeArticles.length > INITIAL_VISIBLE_ARTICLES;

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_ARTICLES);
  }, [contributor?._id, safeArticles.length]);

  return (
    <ul typo="h4" className={`${styles.articles_container} ${safeArticles.length > 0 ? styles.hasArticles : ""}`}>
      <PlainHead className={styles.article_head}></PlainHead>

      <div className={styles.articles}>
        <AnimatePresence initial={false}>
          {visibleArticles.map((article) => {
            const date = article.releaseInfo?.releaseDate || article.releaseDate;

            return (
              <motion.div
                className={styles.article}
                key={article._id || article.slug?.current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <AnimationLink path={article.path || `/stories/${article.category}/${article.slug.current}`}>
                  <ArticleTitle article={article} className={styles.article_title} />
                </AnimationLink>

                <span className={styles.article_date}>
                  <FormatDate
                    date={date}
                    format={{
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }}
                  />
                </span>

                <ArticleCategory articleCategory={article.category} className={styles.type} />
              </motion.div>
            );
          })}
        </AnimatePresence>
        {showPaginationButton ? (
          <Button
            type="button"
            className={styles.loadMoreButton}
            onClick={() => {
              if (hasMoreArticles) {
                setVisibleCount((count) => Math.min(count + ARTICLES_PER_PAGE, safeArticles.length));
                return;
              }

              setVisibleCount(INITIAL_VISIBLE_ARTICLES);
            }}
          >
            {hasMoreArticles ? "Load more" : "Close"}
          </Button>
        ) : null}
      </div>
    </ul>
  );
};

export default ArticleLinks;
