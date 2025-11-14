"use client";

import Link from "next/link";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import AnimationLink from "../components/AnimationLink/AnimationLink";

import LargeFigure from "@/components/LargeFigure/LargeFigure";
import LandscapeFigure from "@/components/LandscapeFigure/LandscapeFigure";
import MediumFigure from "@/components/MediumFigure/MediumFigure";

import styles from "./OverviewPage.module.css";

import { useFilter } from "./helpers/useFilter";

const OverviewPage = ({ data }) => {
  const handleFilter = useFilter(); // ✅ hook called at top level

  const types = ["features", "interviews", "people", "portfolios"];
  const [features, interviews, people, portfolios] = ["features", "interviews", "people", "portfolios"].map((c) =>
    data?.filter((i) => i.category === c)
  );

  const layoutRecipe = () => {
    if (data?.length <= 2) return data?.map((item) => ({ size: "large", item: item }));
    if (data?.length <= 3)
      return [{ size: "large", item: data[0] }, ...data?.slice(1).map((item) => ({ size: "medium", item }))];
    if (data?.length <= 4) {
      return [
        { size: "large", item: data[0] },
        { size: "medium", item: data[1] },
        ...data?.slice(2, 4).map((item) => ({ size: "small", item })),
      ];
    }

    const lookUpSize = (item) => {
      switch (item.type) {
        case "interview":
          return "large";
        case "person":
          return "small";
        case "portfolio":
          return item.satelliteImage.medium.width > item.satelliteImage.medium.height ? "medium" : "small";
        case "feature":
          return "large";
      }
    };

    return data.map((item) => ({ size: lookUpSize(item), item: item })); // default layout
  };

  const lookUpAttributes = (item) => {
    switch (
      item.category // use category — not type, based on your data
    ) {
      case "interviews":
        return {
          title: item.title,
          text: item.teaser,
          media: item.gallery,
        };
      case "people":
        return {
          title: item.name,
          text: undefined,
          medium: item.portrait?.medium,
        };
      case "portfolios":
        return {
          title: item.name,
          text: undefined,
          medium: item.satelliteImage.medium,
        };
      case "features":
        return {
          title: item.title,
          text: undefined,
          medium: item.cover?.medium,
        };
    }
  };

  const figures = layoutRecipe();

  const renderFigure = (figure, index) => {
    const { size, item } = figure;
    const { title, text, media, medium } = lookUpAttributes(item);

    switch (size) {
      case "large":
        return (
          <AnimationLink key={index} className={styles.large} path={`/stories/${item.category}/${item.slug?.current}`}>
            <LargeFigure title={title} desciption={text} media={media} medium={medium} />
          </AnimationLink>
        );
      case "medium":
        return (
          <AnimationLink
            key={index}
            className={styles.landscape}
            path={`/stories/${item.category}/${item.slug?.current}`}
          >
            <LandscapeFigure title={title} desciption={text} media={media} medium={medium} />
          </AnimationLink>
        );
      default:
        return (
          <AnimationLink key={index} className={styles.medium} path={`/stories/${item.category}/${item.slug?.current}`}>
            <MediumFigure title={title} desciption={text} media={media} medium={medium} />
          </AnimationLink>
        );
    }
  };

  return (
    <main className={styles.main}>
      <FilterHeader array={types} handleFilter={handleFilter} />
      <div className={styles.container}>{figures.map(renderFigure)}</div>
    </main>
  );
};

export default OverviewPage;
