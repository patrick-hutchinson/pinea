"use client";

import { useRouter } from "next/navigation";

import { layoutRecipe } from "@/helpers/layoutRecipe";
import { renderFigure } from "@/helpers/renderFigure";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import PineaIcon from "@/components/PineaIcon/PineaIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";

import styles from "./OverviewPage.module.css";

const OverviewPage = ({ data }) => {
  const router = useRouter();

  const handleFilter = (item) => {
    router.push(`/stories/${item}`);
  };

  const types = ["reviews", "interviews", "people", "portfolios"];
  // const [reviews, interviews, people, portfolios] = ["reviews", "interviews", "people", "portfolios"].map((c) =>
  //   data?.filter((i) => i.category === c)
  // );

  const figures = layoutRecipe(data);

  return (
    <main className={styles.main}>
      <FilterHeader array={types} handleFilter={handleFilter} />
      <section className={styles.opening}>{/* <PineaIcon /> */}</section>
      <BlurContainer>
        <div className={styles.container}>{figures?.map(renderFigure)}</div>
      </BlurContainer>
    </main>
  );
};

export default OverviewPage;
