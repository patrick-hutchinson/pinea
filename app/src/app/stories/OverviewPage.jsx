"use client";

import { layoutRecipe } from "@/helpers/layoutRecipe";
import { renderFigure } from "@/helpers/renderFigure";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import PineaIcon from "@/components/PineaIcon/PineaIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";

import { sortAlphabetically } from "@/helpers/sort";

import { GlobalVariablesContext } from "@/context/GlobalVariablesContext";

import styles from "./OverviewPage.module.css";
import { useContext, useEffect, useState } from "react";

const OverviewPage = ({ data }) => {
  const { header_height, filter_height } = useContext(GlobalVariablesContext);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleFilter = (item) => {
    setSelectedCategory(item);
  };

  useEffect(() => {
    if (selectedCategory) {
      const normalized = selectedCategory.replace(/\s+/g, "-"); // "spot on" → "spot-on"
      const el = document.querySelector(`.${normalized}`);

      if (el) {
        const offset = header_height + filter_height;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }, [selectedCategory]);

  const array = ["reviews", "visits", "people", "portfolios", "spot on"];
  const types = sortAlphabetically(array);

  const figures = layoutRecipe(data);

  return (
    <main className={styles.main}>
      <FilterHeader array={types} handleFilter={handleFilter} />
      <section className={styles.opening}>
        <PineaIcon />
      </section>
      <BlurContainer>
        <div className={styles.container}>{figures?.map(renderFigure)}</div>
      </BlurContainer>
    </main>
  );
};

export default OverviewPage;
