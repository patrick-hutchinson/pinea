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
  console.log(article.category, "category");

  const [hovering, setHovering] = useState(null);
  const [image, setImage] = useState(null);

  const isPrint = article._type === "print";
  const medium = isPrint ? "Print" : "Online";
  const isPerson = article.type === "person";

  const Wrapper = isPrint ? "div" : AnimationLink;
  const wrapperProps = isPrint
    ? {}
    : {
        path: isPerson
          ? `/stories/recommended/${article.slug?.current}`
          : `/stories/${article.category}/${article.slug?.current}`,
      };

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
      <div className={`${styles.indexItem_inner} ${!isPrint && styles.isLink}`}>
        <Wrapper {...wrapperProps} className={styles.articleTitle}>
          <ArticleTitle article={article} />
        </Wrapper>

        <ArticleAuthor article={article} className={styles.articleAuthor} />

        <ArticleCategory articleCategory={article.category} className={styles.articleCategory} />

        <div className={styles.articleMedium} style={{ display: "flex" }}>
          {medium} Periodical,&nbsp;
          <span>
            <FormatDate
              date={article.releaseDate}
              className={styles.articleReleaseDate}
              locale="de-DE"
              format={{
                day: "numeric",
                month: "long",
                year: "numeric",
              }}
            />
          </span>{" "}
        </div>

        {/* <FormatDate
          date={article.releaseDate}
          className={styles.articleReleaseDate}
          format={{
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }}
        /> */}
      </div>

      <ImagePreview medium={image} hovering={hovering} />
    </div>
  );
};

export default IndexItem;
