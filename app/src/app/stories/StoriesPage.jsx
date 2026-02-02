"use client";

import { layoutStories } from "@/components/Stories/helpers/layoutStories";
import { renderStoryPreview } from "@/components/Stories/helpers/renderStoryPreview";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import PineaIcon from "@/components/PineaIcon/PineaIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";

import { sortAlphabetically } from "@/helpers/sort";

import { CSSContext } from "@/context/CSSContext";

import styles from "./StoriesPage.module.css";
import { useContext, useEffect, useState } from "react";

const StoriesPage = ({ data }) => {
  const { header_height, filter_height } = useContext(CSSContext);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleFilter = (item) => {
    setSelectedCategory(item);
  };

  useEffect(() => {
    if (selectedCategory) {
      const normalized = selectedCategory.replace(/\s+/g, "-").toLowerCase(); // "spot on" → "spot-on"
      const el = document.querySelector(`.${normalized}`);

      if (el) {
        const offset = header_height + filter_height;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }, [selectedCategory]);

  const array = ["Reviews", "Visits", "Recommended", "Portfolios", "Spot On"];
  const types = sortAlphabetically(array);

  const layoutedStories = layoutStories(data);

  return (
    <main className={styles.main}>
      <FilterHeader array={types} handleFilter={handleFilter} />
      <section className={styles.opening}>
        <PineaIcon className={styles.pineaIcon} />
      </section>
      <BlurContainer>
        <div className={styles.container}>{layoutedStories?.map(renderStoryPreview)}</div>
      </BlurContainer>
    </main>
  );
};

export default StoriesPage;
