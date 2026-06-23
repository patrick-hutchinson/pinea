"use client";

import FormatDate from "@/components/FormatDate/FormatDate";
import { motion } from "framer-motion";
import ArticleTitle from "@/components/Articles/ArticleTitle";
import ArticleCategory from "@/components/Articles/ArticleCategory";
import ArticleAuthor from "@/components/Articles/ArticleAuthor";

import AnimationLink from "@/components/Animation/AnimationLink";
import ShareButton from "@/components/Buttons/ShareButton";

import styles from "../ArchivePage.module.css";

const SHARE_BUTTON_HIDE_RADIUS = 100;

const isPointNearRect = (point, rect, radius) => {
  if (!point || !rect) return false;

  const closestX = Math.max(rect.left, Math.min(point.x, rect.right));
  const closestY = Math.max(rect.top, Math.min(point.y, rect.bottom));
  const distanceX = point.x - closestX;
  const distanceY = point.y - closestY;

  return Math.hypot(distanceX, distanceY) <= radius;
};

const IndexItem = ({ article, itemKey, id, shareUrl, onPreviewStart, onPreviewMove }) => {
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
    const point = { x: event.clientX, y: event.clientY };
    const actions = event.currentTarget.querySelector(`.${styles.archiveActions}`);
    const isNearShareButton = isPointNearRect(point, actions?.getBoundingClientRect(), SHARE_BUTTON_HIDE_RADIUS);

    onPreviewMove?.(itemKey, point, { isNearShareButton });
  };

  return (
    <motion.li
      id={id}
      className={`${styles.indexItem}`}
      typo="h4"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: { duration: 0.2, ease: "easeInOut" },
        layout: { duration: 0.3, ease: "easeInOut" },
      }}
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
          <span className={styles.articleMediumText}>
            <FormatDate
              date={date}
              locale="de-DE"
              format={{
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }}
            />
            , {medium}
          </span>
          <span className={styles.archiveActions}>
            {shareUrl ? <ShareButton url={shareUrl} className={styles.shareButton} /> : null}
          </span>
        </div>
      </Wrapper>
    </motion.li>
  );
};

export default IndexItem;
