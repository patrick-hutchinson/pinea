"use client";

import Link from "next/link";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import AnimationLink from "../components/AnimationLink";

import LargeFigure from "@/components/LargeFigure/LargeFigure";
import LandscapeFigure from "@/components/LandscapeFigure/LandscapeFigure";
import MediumFigure from "@/components/MediumFigure/MediumFigure";

import styles from "./OverviewPage.module.css";

const types = ["features", "interviews", "people", "portfolios"];

const OverviewPage = ({ data }) => {
  const pluralMap = {
    feature: "features",
    interview: "interviews",
    person: "people",
    portfolio: "portfolios",
  };

  const grouped = Object.fromEntries(
    Object.entries(pluralMap).map(([type, plural]) => [plural, data?.filter((item) => item.type === type)])
  );

  const { features, interviews, people, portfolios } = grouped;

  return (
    <main>
      <FilterHeader array={types} />
      <div className={styles.container}>
        {interviews?.map((interview, index) => {
          console.log(interview.gallery, "gallery");
          return (
            <AnimationLink className={styles.large} key={index} path={`/stories/interviews/${interview.slug.current}`}>
              <LargeFigure title={interview.title} desciption={interview.teaser} media={interview.gallery} />
            </AnimationLink>
          );
        })}
        {portfolios?.map((portfolio, index) => {
          const orientation =
            portfolio.satelliteImage.medium.width > portfolio.satelliteImage.medium.height ? "landscape" : "portrait";

          return orientation === "landscape" ? (
            <AnimationLink
              className={styles.landscape}
              key={index}
              path={`stories/portfolios/${portfolio.slug.current}`}
            >
              <LandscapeFigure
                title={portfolio.name}
                desciption={portfolio.teaser}
                medium={portfolio.satelliteImage.medium}
              />
            </AnimationLink>
          ) : (
            <AnimationLink className={styles.medium} key={index} path={`stories/portfolios/${portfolio.slug.current}`}>
              <MediumFigure
                title={portfolio.name}
                desciption={portfolio.teaser}
                medium={portfolio.satelliteImage.medium}
              />
            </AnimationLink>
          );
        })}
        {features?.map((feature, index) => {
          return (
            <AnimationLink className={styles.large} key={index} path={`stories/features/unknown}`}>
              <LargeFigure title={feature.title} desciption={feature.description} medium={feature.cover.medium} />
            </AnimationLink>
          );
        })}
        {people?.map((person, index) => {
          return (
            <AnimationLink className={styles.medium} key={index} path={`/people/${person.slug.current}`}>
              <MediumFigure
                title={person.name}
                // desciption={portfolio.teaser}
                medium={person.portrait.medium}
              />
            </AnimationLink>
          );
        })}
      </div>
    </main>
  );
};

export default OverviewPage;
