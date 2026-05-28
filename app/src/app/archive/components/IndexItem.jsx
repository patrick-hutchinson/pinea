import FormatDate from "@/components/FormatDate/FormatDate";
import ArticleTitle from "@/components/Articles/ArticleTitle";
import ArticleCategory from "@/components/Articles/ArticleCategory";
import ArticleAuthor from "@/components/Articles/ArticleAuthor";

import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "../ArchivePage.module.css";

const IndexItem = ({ article, itemKey, onPreviewStart, onPreviewMove }) => {
  const isPrint = article._type === "print";
  const medium = isPrint ? "Print" : "Online";
  const isPerson = article.type === "person";
  const date = article?.releaseInfo?.releaseDate || article?.releaseDate;

  const Wrapper = AnimationLink;
  const wrapperProps = {
    path: isPrint
      ? "/print-periodical"
      : isPerson
        ? `/stories/recommended/${article.slug?.current}`
        : `/stories/${article.category}/${article.slug?.current}`,
  };
  const rowClassName = [styles.indexItem_inner, styles.isLink].filter(Boolean).join(" ");

  const handleMouseEnter = (event) => {
    const previewImage =
      article?.cover?.type === "slideshow"
        ? article?.cover?.medium?.gallery?.[0]?.medium
        : article?.cover?.medium || article?.periodicalCover?.medium || article?.portrait?.medium;

    onPreviewStart?.(itemKey, previewImage || null, { x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    onPreviewMove?.(itemKey, { x: event.clientX, y: event.clientY });
  };

  return (
    <div
      className={`${styles.indexItem}`}
      typo="h4"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
    >
      <Wrapper {...wrapperProps} className={rowClassName}>
        <div className={styles.articleTitle}>
          <ArticleTitle article={article} />
        </div>

        <ArticleAuthor article={article} className={styles.articleAuthor} />

        <ArticleCategory articleCategory={article.category} className={styles.articleCategory} />

        <div className={styles.articleMedium}>
          {medium} Periodical,{" "}
          <FormatDate
            date={date}
            locale="de-DE"
            format={{
              day: "numeric",
              month: "long",
              year: "numeric",
            }}
          />
        </div>
      </Wrapper>

    </div>
  );
};

export default IndexItem;
