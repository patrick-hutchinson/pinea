import { Fragment } from "react";
import { useState, useEffect } from "react";

import FormatDate from "@/components/FormatDate/FormatDate";
import ArticleTitle from "@/components/Articles/ArticleTitle";
import ArticleCategory from "@/components/Articles/ArticleCategory";
import ArticleAuthor from "@/components/Articles/ArticleAuthor";

import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "../IndexPage.module.css";
import ImagePreview from "./ImagePreview";

const IndexItem = ({ article }) => {
  console.log(article, "article");

  const [hovering, setHovering] = useState(null);
  const [image, setImage] = useState(null);

  const isPrint = article._type === "print";
  const medium = isPrint ? "Print" : "Online";

  const Wrapper = isPrint ? "div" : AnimationLink;
  const wrapperProps = isPrint ? {} : { path: `/stories/${article.category}/${article.slug?.current}` };

  const handleMouseEnter = () => {
    setHovering(true);
    setImage(article.cover.type === "slideshow" ? article.cover.medium.gallery[0].medium : article.cover.medium);
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
      <div className={`${styles.indexItem_inner} ${!isPrint && styles.isLink}`}>
        <Wrapper {...wrapperProps} className={styles.articleTitle}>
          <ArticleTitle article={article} />
        </Wrapper>

        <ArticleAuthor article={article} className={styles.articleAuthor} />

        <ArticleCategory articleCategory={article.category} className={styles.articleCategory} />

        <div className={styles.articleMedium}>{medium}</div>

        <FormatDate
          date={article.releaseDate}
          className={styles.articleReleaseDate}
          format={{
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }}
        />
      </div>

      <ImagePreview medium={image} hovering={hovering} />
    </div>
  );
};

export default IndexItem;
