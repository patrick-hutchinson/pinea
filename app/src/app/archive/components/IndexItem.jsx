import { useState } from "react";

import FormatDate from "@/components/FormatDate/FormatDate";
import ArticleTitle from "@/components/Articles/ArticleTitle";
import ArticleCategory from "@/components/Articles/ArticleCategory";
import ArticleAuthor from "@/components/Articles/ArticleAuthor";

import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "../ArchivePage.module.css";
import ImagePreview from "./ImagePreview";

const IndexItem = ({ article }) => {
  const [hovering, setHovering] = useState(null);
  const [image, setImage] = useState(null);

  const isPrint = article._type === "print";
  const medium = isPrint ? "Print" : "Online";
  const isPerson = article.type === "person";
  const date = article?.releaseInfo?.releaseDate || article?.releaseDate;

  const Wrapper = isPrint ? "div" : AnimationLink;
  const wrapperProps = isPrint
    ? {}
    : {
        path: isPerson
          ? `/stories/recommended/${article.slug?.current}`
          : `/stories/${article.category}/${article.slug?.current}`,
      };
  const rowClassName = [styles.indexItem_inner, !isPrint ? styles.isLink : null].filter(Boolean).join(" ");

  const handleMouseEnter = () => {
    setHovering(true);
    const previewImage =
      article?.cover?.type === "slideshow"
        ? article?.cover?.medium?.gallery?.[0]?.medium
        : article?.cover?.medium || article?.portrait?.medium;

    setImage(previewImage || null);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    setImage(null);
  };

  return (
    <div
      className={`${styles.indexItem}`}
      typo="h4"
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
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

      <ImagePreview medium={image} hovering={hovering} />
    </div>
  );
};

export default IndexItem;
