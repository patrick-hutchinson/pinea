"use client";

import Link from "next/link";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import AnimationLink from "../components/AnimationLink";

import LargeFigure from "@/components/LargeFigure/LargeFigure";
import LandscapeFigure from "@/components/LandscapeFigure/LandscapeFigure";
import MediumFigure from "@/components/MediumFigure/MediumFigure";

import styles from "./OverviewPage.module.css";

import { useRouter } from "next/navigation";

const OverviewPage = ({ data }) => {
  const router = useRouter();

  const types = ["features", "interviews", "people", "portfolios"];
  const [features, interviews, people, portfolios] = types.map((c) => data?.filter((i) => i.category === c));

  const handleFilter = (item) => {
    router.push(`/stories/${item}`);
  };

  const layoutStrategy = (items) => {
    const count = items.length;

    if (count <= 2) return items.map((i) => ({ type: "large", item: i }));
    if (count === 3)
      return [{ type: "large", item: items[0] }, ...items.slice(1).map((i) => ({ type: "horizontal", item: i }))];
    return items.map((i) => ({ type: "auto", item: i })); // default layout
  };

  const renderFigure = (figure, index) => {
    const { type, item } = figure;

    switch (type) {
      case "large":
        return (
          <AnimationLink key={index} className={styles.large} path={`/stories/${item.category}/${item.slug?.current}`}>
            <LargeFigure title={item.title} desciption={item.teaser} media={item.gallery} />
          </AnimationLink>
        );
      case "horizontal":
        return (
          <AnimationLink
            key={index}
            className={styles.landscape}
            path={`/stories/${item.category}/${item.slug?.current}`}
          >
            <LandscapeFigure title={item.title} desciption={item.teaser} media={item.gallery} />
          </AnimationLink>
        );
      default:
        return (
          <AnimationLink key={index} className={styles.medium} path={`/stories/${item.category}/${item.slug?.current}`}>
            <MediumFigure title={item.title} desciption={item.teaser} media={item.gallery} />
          </AnimationLink>
        );
    }
  };

  return (
    <main className={styles.main}>
      <FilterHeader array={types} handleFilter={handleFilter} />

      <div className={styles.container}>
        {layoutStrategy(interviews).map(renderFigure)}
        {layoutStrategy(portfolios).map(renderFigure)}
        {layoutStrategy(features).map(renderFigure)}
        {layoutStrategy(people).map(renderFigure)}
      </div>
    </main>
  );
};

export default OverviewPage;
