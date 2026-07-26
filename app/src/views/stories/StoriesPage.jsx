"use client";

import { useEffect, useMemo, useState } from "react";
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

  const handleFilter = (filter) => {
    const selected = categoryOptions.find((option) => option.label === filter);
    if (!selected) return;

    setActiveCategory((prev) => (prev === selected.value ? null : selected.value));
  };

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
