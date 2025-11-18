"use client";

import { useRouter } from "next/navigation";

import { layoutRecipe } from "@/helpers/layoutRecipe";
import { renderFigure } from "@/helpers/renderFigure";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import PineaIcon from "@/components/PineaIcon/PineaIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";

import styles from "@/pages/OverviewPage/OverviewPage.module.css";

const OverviewPage = ({ data }) => {
  const router = useRouter();

  const handleFilter = (item) => {
    router.push(`/stories/${item}`);
  };

  const types = ["reviews", "interviews", "people", "portfolios", "spot-on"];

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
