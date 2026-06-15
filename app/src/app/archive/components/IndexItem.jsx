"use client";

import FormatDate from "@/components/FormatDate/FormatDate";
import { motion } from "framer-motion";
import { useContext } from "react";
import ArticleTitle from "@/components/Articles/ArticleTitle";
import ArticleCategory from "@/components/Articles/ArticleCategory";
import ArticleAuthor from "@/components/Articles/ArticleAuthor";

import AnimationLink from "@/components/Animation/AnimationLink";
import ShareButton from "@/components/Buttons/ShareButton";
import Icon from "@/components/Icon/Icon";
import { LanguageContext } from "@/context/LanguageContext";
import { withLocalePathname } from "@/lib/i18n";

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

const appendDownloadParam = (url, filename) => {
  if (!url) return "";
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}dl=${encodeURIComponent(filename || "download.pdf")}`;
};

const downloadFile = (url, filename) => {
  if (!url) return;

  const link = document.createElement("a");
  link.href = appendDownloadParam(url, filename);
  link.download = filename || "";
  link.rel = "noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const ArchiveAccessIcon = ({ canDownload, onDownloadClick, onMembershipClick, className = "" }) => {
  if (canDownload) {
    return (
      <span
        role="button"
        tabIndex={0}
        className={`${styles.archiveIconButton} ${styles.downloadButton} ${className}`}
        aria-label="Download archive PDF"
        onClick={onDownloadClick}
        onKeyDown={(event) => handleActionKeyDown(event, onDownloadClick)}
      >
        <Icon path="/icons/download.svg" />
      </span>
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      className={`${styles.archiveIconButton} ${styles.memberButton} ${className}`}
      aria-label="View memberships"
      onClick={onMembershipClick}
      onKeyDown={(event) => handleActionKeyDown(event, onMembershipClick)}
    >
      <Icon path="/icons/member.svg" />
    </span>
  );
};

const handleActionKeyDown = (event, handler) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  handler(event);
};

const IndexItem = ({ article, itemKey, id, shareUrl, canDownloadArchiveFiles, onPreviewStart, onPreviewMove }) => {
  const { language } = useContext(LanguageContext);
  const isPrint = article._type === "print";
  const medium = isPrint ? "Print" : "Online";
  const isPerson = article.type === "person";
  const date = article?.releaseInfo?.releaseDate || article?.releaseDate;
  const downloadAsset = article?.PDFDownload?.asset || null;
  const downloadUrl = downloadAsset?.url || "";
  const downloadFilename = downloadAsset?.originalFilename || `${id}.pdf`;
  const hasDownload = Boolean(downloadUrl);

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

  const handleDownloadClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    downloadFile(downloadUrl, downloadFilename);
  };

  const handleMembershipClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    window.location.href = withLocalePathname("/memberships", language);
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
          {hasDownload ? (
            <ArchiveAccessIcon
              canDownload={canDownloadArchiveFiles}
              onDownloadClick={handleDownloadClick}
              onMembershipClick={handleMembershipClick}
              className={styles.mobileAccessAction}
            />
          ) : null}
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
            {hasDownload && canDownloadArchiveFiles ? (
              <ArchiveAccessIcon
                canDownload={canDownloadArchiveFiles}
                onDownloadClick={handleDownloadClick}
                onMembershipClick={handleMembershipClick}
                className={styles.desktopAccessAction}
              />
            ) : null}
            {hasDownload && !canDownloadArchiveFiles ? (
              <ArchiveAccessIcon
                canDownload={canDownloadArchiveFiles}
                onDownloadClick={handleDownloadClick}
                onMembershipClick={handleMembershipClick}
                className={styles.desktopAccessAction}
              />
            ) : null}
            {shareUrl ? <ShareButton url={shareUrl} className={styles.shareButton} /> : null}
          </span>
        </div>
      </Wrapper>
    </motion.li>
  );
};

export default IndexItem;
