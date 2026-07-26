"use client";

import { useState, useContext, useCallback, useEffect, useMemo } from "react";
import { AnimatePresence, LayoutGroup } from "framer-motion";

import { LanguageContext } from "@/context/LanguageContext";
import { StateContext } from "@/context/StateContext";
import { CSSContext } from "@/context/CSSContext";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import SitePineaIcon from "@/components/PineaIcon/SitePineaIcon";
import IndexItem from "./components/IndexItem";
import ImagePreview from "./components/ImagePreview";
import { useScrollToHash } from "@/helpers/scrollToHash";
import { withLocalePathname } from "@/lib/i18n";

import styles from "./ArchivePage.module.css";

const CATEGORY_ORDER = {
  visit: 0,
  visits: 0,
  review: 1,
  reviews: 1,
  portfolio: 2,
  portfolios: 2,
  spotOn: 3,
  "spot-on": 3,
};

const collator = new Intl.Collator(undefined, { sensitivity: "base" });

const getReleaseTimestamp = (article) => {
  const date = article?.releaseInfo?.releaseDate || article?.releaseDate;
  const time = new Date(date).getTime();
  return Number.isNaN(time) ? -Infinity : time;
};

const getCategoryRank = (category) => {
  return CATEGORY_ORDER[category] ?? Number.MAX_SAFE_INTEGER;
};

const getContributorName = (article) => {
  const contributors = article?.releaseInfo?.contributor;

  if (contributors && !Array.isArray(contributors)) {
    if (typeof contributors === "string") return contributors;
    if (contributors?.name) return contributors.name;
  }

  if (Array.isArray(contributors) && contributors.length > 0) {
    const first = contributors[0];
    if (typeof first === "string") return first;
    if (first?.name) return first.name;
  }

  const { author } = article ?? {};
  if (Array.isArray(author) && author.length > 0) {
    const firstAuthor = author[0];
    if (typeof firstAuthor === "string") return firstAuthor;
    if (firstAuthor?.name) return firstAuthor.name;
  }

  if (typeof author === "string") return author;

  return "";
};

const getContributorLastName = (article) => {
  const fullName = getContributorName(article).trim();
  if (!fullName) return "";

  const parts = fullName.split(/\s+/);
  return parts[parts.length - 1];
};

const getArchiveArticleId = (article, index = 0) =>
  article?.slug?.current ||
  article?._id ||
  article?._key ||
  `${article?.category || article?._type || article?.type || "archive"}-${index}`;

const getArchivePreviewMedium = (article) =>
  article?.cover?.type === "slideshow"
    ? article?.cover?.medium?.gallery?.[0]?.medium
    : article?.cover?.medium || article?.periodicalCover?.medium || article?.portrait?.medium;

const sortArchiveArticles = (a, b) => {
  // 1) Newest release date first
  const releaseA = getReleaseTimestamp(a);
  const releaseB = getReleaseTimestamp(b);

  if (Number.isFinite(releaseA) && Number.isFinite(releaseB) && releaseA !== releaseB) {
    return releaseB - releaseA;
  }

  if (Number.isFinite(releaseA) && !Number.isFinite(releaseB)) return -1;
  if (!Number.isFinite(releaseA) && Number.isFinite(releaseB)) return 1;

  // 2) Category order: visit -> review -> portfolio -> spotOn
  const categoryA = getCategoryRank(a?.category);
  const categoryB = getCategoryRank(b?.category);
  if (categoryA !== categoryB) return categoryA - categoryB;

  // 3) Contributor last name (alphabetical)
  const lastNameDiff = collator.compare(getContributorLastName(a), getContributorLastName(b));
  if (lastNameDiff !== 0) return lastNameDiff;

  // Keep ordering deterministic if all sort keys above match
  return collator.compare(getContributorName(a), getContributorName(b));
};

const ArchivePage = ({ articles }) => {
  const { isMobile } = useContext(StateContext);
  const { language } = useContext(LanguageContext);
  const { header_height_total } = useContext(CSSContext);

  const [activeMedia, setActiveMedia] = useState([]);
  const [hoverPreview, setHoverPreview] = useState({
    hovering: false,
    point: null,
    key: null,
  });

  const handleFilter = (filter) => {
    setActiveMedia((prev) => {
      if (prev.includes(filter)) {
        // already active → remove it
        return prev.filter((f) => f !== filter);
      } else {
        // not active → add it
        return [...prev, filter];
      }
    });
  };

  const filteredArticles = useMemo(
    () =>
      articles
        .filter(Boolean)
        .filter((article) => {
          if (activeMedia.length === 0) return true; // no filters → show all

          const medium = article._type === "print" ? "Print" : "Online";
          return activeMedia.includes(medium); // ✅ check activeMedia, not articles
        })
        .sort(sortArchiveArticles),
    [activeMedia, articles],
  );

  const previewItems = useMemo(
    () =>
      filteredArticles
        .map((article, index) => ({
          key: getArchiveArticleId(article, index),
          medium: getArchivePreviewMedium(article),
        }))
        .filter((item) => item.medium),
    [filteredArticles],
  );

  useScrollToHash(-header_height_total - 50, [header_height_total]);

  useEffect(() => {
    const targetId = window.location.hash.replace("#", "");
    const el = document.getElementById(targetId);
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add(styles.blink);
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.9,
      },
    );

    observer.observe(el);
  }, []);

  const handlePreviewStart = useCallback((key, medium, point) => {
    if (!medium) return;

    setHoverPreview((prev) => ({
      hovering: true,
      point: point || prev.point || null,
      key: key || null,
    }));
  }, []);

  const handlePreviewMove = useCallback((key, point, options = {}) => {
    if (!point) return;

    setHoverPreview((prev) => {
      if (prev.key !== key) return prev;
      const hovering = !options.isNearShareButton;
      if (prev.hovering === hovering) return prev;
      return { ...prev, hovering };
    });
  }, []);

  const handlePreviewEnd = useCallback((key) => {
    setHoverPreview((prev) => {
      if (prev.key !== key) return prev;
      return { hovering: false, point: prev.point, key: null };
    });
  }, []);

  const hidePreview = useCallback(() => {
    setHoverPreview((prev) => {
      if (!prev.hovering) return prev;
      return { hovering: false, point: prev.point, key: null };
    });
  }, []);

  return (
    <main className={styles.main}>
      <FilterHeader
        array={["Online", "Print", { label: "P.IN.E.A Events", href: "/pinea-events" }]}
        handleFilter={handleFilter}
        currentlyActive={activeMedia}
      />

      <div className={styles.indexHeader} typo="h5" onMouseEnter={hidePreview}>
        <>
          {isMobile ? (
            <>
              <div>{language === "en" ? "STORY, CONTRIBUTOR" : "STORY, AUTOR:IN"}</div>
              <div>{language === "en" ? "DATE/MEDIUM" : "DATUM/MEDIUM"}</div>
            </>
          ) : (
            <>
              <div>STORY</div>
              <div>{language === "en" ? "CONTRIBUTOR" : "AUTOR:IN"}</div>
              <div>{language === "en" ? "CATEGORY" : "KATEGORIE"}</div>
              <div>{language === "en" ? "DATE/MEDIUM" : "DATUM/MEDIUM"}</div>
            </>
          )}
        </>
      </div>
      <div className={styles.content}>
        <LayoutGroup>
          <ul onMouseLeave={() => handlePreviewEnd(hoverPreview.key)}>
            <AnimatePresence initial={false} mode="popLayout">
              {filteredArticles.map((article, index) => {
                const key = getArchiveArticleId(article, index);

                return (
                  <IndexItem
                    key={key}
                    id={key}
                    itemKey={key}
                    shareUrl={`${withLocalePathname("/archive", language)}#${key}`}
                    article={article}
                    onPreviewStart={handlePreviewStart}
                    onPreviewMove={handlePreviewMove}
                  />
                );
              })}
            </AnimatePresence>
          </ul>
        </LayoutGroup>
      </div>

      <ImagePreview
        items={previewItems}
        activeKey={hoverPreview.key}
        hovering={hoverPreview.hovering}
        point={hoverPreview.point}
      />

      <SitePineaIcon />
    </main>
  );
};

export default ArchivePage;
