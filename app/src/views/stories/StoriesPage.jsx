"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { layoutStories } from "@/components/Stories/helpers/layoutStories";
import { getStoryPreviewClassName, renderStoryPreview } from "@/components/Stories/helpers/renderStoryPreview";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import SitePineaIcon from "@/components/PineaIcon/SitePineaIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import { useLenisContext } from "@/context/LenisContext";

import styles from "./StoriesPage.module.css";

const storyTransition = {
  opacity: { duration: 0.4, ease: "easeInOut" },
  layout: { duration: 0.4, ease: "easeInOut" },
};

const STORY_CATEGORY_LABELS = {
  reviews: "Reviews",
  visits: "Visits",
  recommended: "Recommended",
  portfolios: "Portfolios",
  "spot-on": "Spot On",
};

const STORY_CATEGORY_ORDER = ["portfolios", "recommended", "reviews", "spot-on", "visits"];
const STORY_FILTER_QUERY_KEY = "filter";

const STORY_CATEGORY_ALIASES = {
  portfolio: "portfolios",
  portfolios: "portfolios",
  recommendation: "recommended",
  recommendations: "recommended",
  recommended: "recommended",
  review: "reviews",
  reviews: "reviews",
  "spot-on": "spot-on",
  spot_on: "spot-on",
  spoton: "spot-on",
  visit: "visits",
  visits: "visits",
};

const normalizeStoryCategory = (value) => {
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase().replace(/\s+/g, "-");
  return STORY_CATEGORY_ALIASES[normalized] || normalized;
};

const writeStoryFilterToUrl = (category) => {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);

  if (category) {
    url.searchParams.set(STORY_FILTER_QUERY_KEY, category);
  } else {
    url.searchParams.delete(STORY_FILTER_QUERY_KEY);
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (nextUrl === currentUrl) return;

  window.history.pushState(
    {
      ...window.history.state,
      storiesFilter: category,
    },
    "",
    nextUrl,
  );
};

const StoriesPage = ({ data }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const lenis = useLenisContext();
  const categoryValues = useMemo(
    () =>
      Array.from(
        new Set(data.map((item) => item?.category).filter((value) => typeof value === "string" && value.length > 0)),
      ),
    [data],
  );

  const categoryOptions = useMemo(
    () =>
      STORY_CATEGORY_ORDER.filter((value) => categoryValues.includes(value)).map((value) => ({
        value,
        label: STORY_CATEGORY_LABELS[value] || value,
      })),
    [categoryValues],
  );

  const getCategoryFromUrl = useCallback(() => {
    if (typeof window === "undefined") return null;

    const params = new URLSearchParams(window.location.search);
    const filter = normalizeStoryCategory(params.get(STORY_FILTER_QUERY_KEY));
    if (!filter) return null;

    return (
      categoryOptions.find((option) => {
        const label = normalizeStoryCategory(option.label);
        const value = normalizeStoryCategory(option.value);

        return filter === value || filter === label;
      })?.value || null
    );
  }, [categoryOptions]);

  const handleFilter = useCallback(
    (filter) => {
      const selected = categoryOptions.find((option) => option.label === filter);
      if (!selected) return;

      const nextCategory = activeCategory === selected.value ? null : selected.value;

      setActiveCategory(nextCategory);
      writeStoryFilterToUrl(nextCategory);
    },
    [activeCategory, categoryOptions],
  );

  useEffect(() => {
    if (!categoryOptions.length) return undefined;

    const syncCategoryFromUrl = () => {
      setActiveCategory(getCategoryFromUrl());
    };

    syncCategoryFromUrl();
    window.addEventListener("popstate", syncCategoryFromUrl);

    return () => {
      window.removeEventListener("popstate", syncCategoryFromUrl);
    };
  }, [categoryOptions.length, getCategoryFromUrl]);

  useEffect(() => {
    if (!activeCategory) return;

    const hasCategory = categoryOptions.some((option) => option.value === activeCategory);
    if (hasCategory) return;

    setActiveCategory(null);
  }, [activeCategory, categoryOptions]);

  const allStories = useMemo(() => layoutStories(data), [data]);
  const visibleStories = useMemo(() => {
    if (!activeCategory) return allStories;

    return allStories.filter((figure) => figure?.item?.category === activeCategory);
  }, [activeCategory, allStories]);

  const activeCategoryLabel = activeCategory
    ? categoryOptions.find((option) => option.value === activeCategory)?.label
    : null;

  useEffect(() => {
    if (!lenis?.resize) return undefined;

    const frame = window.requestAnimationFrame(() => {
      lenis.resize();
    });
    const timeout = window.setTimeout(() => {
      lenis.resize();
    }, 450);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [activeCategory, lenis, visibleStories.length]);

  return (
    <main className={styles.main}>
      <FilterHeader
        array={categoryOptions.map((option) => option.label)}
        handleFilter={handleFilter}
        currentlyActive={activeCategoryLabel}
      />
      <section className={styles.opening}>
        <SitePineaIcon />
      </section>

      <LayoutGroup>
        <div className={styles.container}>
          <AnimatePresence initial={false} mode="popLayout">
            {visibleStories?.map((figure, index) => {
              const item = figure?.item;
              const previewKey = item?._id || item?.slug?.current || `${figure?.size || "story"}-${index}`;
              const outerClassName = [styles[figure?.size], item?.category].filter(Boolean).join(" ");
              const innerClassName = getStoryPreviewClassName(figure);

              return (
                <motion.div
                  className={outerClassName}
                  key={previewKey}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={storyTransition}
                >
                  {renderStoryPreview(figure, index, previewKey, `${styles.storyTileInner} ${innerClassName}`)}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </main>
  );
};

export default StoriesPage;
