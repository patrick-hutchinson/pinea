"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { layoutStories } from "@/components/Stories/helpers/layoutStories";
import { getStoryPreviewClassName, renderStoryPreview } from "@/components/Stories/helpers/renderStoryPreview";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import SitePineaIcon from "@/components/PineaIcon/SitePineaIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";

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
  const [activeCategories, setActiveCategories] = useState([]);
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

    setActiveCategories((prev) => {
      if (prev.includes(selected.value)) return prev.filter((item) => item !== selected.value);
      return [...prev, selected.value];
    });
  };

  const allStories = useMemo(() => layoutStories(data), [data]);
  const visibleStories = useMemo(() => {
    if (activeCategories.length === 0) return allStories;

    return allStories.filter((figure) => activeCategories.includes(figure?.item?.category));
  }, [activeCategories, allStories]);

  const activeCategoryLabels = activeCategories
    .map((value) => categoryOptions.find((option) => option.value === value)?.label)
    .filter(Boolean);

  return (
    <main className={styles.main}>
      <FilterHeader
        array={categoryOptions.map((option) => option.label)}
        handleFilter={handleFilter}
        currentlyActive={activeCategoryLabels}
      />
      <section className={styles.opening}>
        <SitePineaIcon />
      </section>
      <BlurContainer>
        <LayoutGroup>
          <div className={styles.container}>
            <AnimatePresence initial={false} mode="popLayout">
              {visibleStories?.map((figure, index) => {
                const item = figure?.item;
                const previewKey = item?._id || item?.slug?.current || `${figure?.size || "story"}-${index}`;

                return (
                  <motion.div
                    className={getStoryPreviewClassName(figure)}
                    key={previewKey}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={storyTransition}
                  >
                    {renderStoryPreview(figure, index, previewKey, styles.storyTileInner)}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </BlurContainer>
    </main>
  );
};

export default StoriesPage;
