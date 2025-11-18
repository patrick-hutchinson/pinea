import { lookUpAttributes } from "@/helpers/lookUpAttributes";

import AnimationLink from "@/components/AnimationLink/AnimationLink";
import FullFigure from "@/components/Figures/FullFigure/FullFigure";
import HalfFigure from "@/components/Figures/HalfFigure/HalfFigure";
import QuarterFigure from "@/components/Figures/QuarterFigure/QuarterFigure";
import EigthFigure from "@/components/Figures/EigthFigure/EigthFigure";
import DefaultFigure from "@/components/Figures/DefaultFigure";

import BlurSpotlight from "@/components/BlurSpotlight/BlurSpotlight";

import styles from "@/pages/OverviewPage/OverviewPage.module.css";

export const renderFigure = (figure, index) => {
  const { size, item } = figure;
  const { title, text, media, medium } = lookUpAttributes(item);

  const isPortfolio = item.type === "portfolio";
  console.log(isPortfolio, "isPortfolio?");

  switch (size) {
    case "full":
      return (
        <AnimationLink key={index} className={styles.full} path={`/stories/${item.category}/${item.slug?.current}`}>
          <DefaultFigure storyType={item.type} title={title} desciption={text} media={media} medium={medium} />
        </AnimationLink>
      );
    case "half":
      return (
        <AnimationLink key={index} className={styles.half} path={`/stories/${item.category}/${item.slug?.current}`}>
          <DefaultFigure storyType={item.type} title={title} desciption={text} media={media} medium={medium} />
        </AnimationLink>
      );
    case "quarter":
      const Comp = isPortfolio ? BlurSpotlight : DefaultFigure;
      return (
        <AnimationLink key={index} className={styles.quarter} path={`/stories/${item.category}/${item.slug?.current}`}>
          <Comp storyType={item.type} title={title} desciption={text} media={media} medium={medium} />
        </AnimationLink>
      );
    case "eigth": {
      const Comp = isPortfolio ? BlurSpotlight : DefaultFigure;

      return (
        <AnimationLink key={index} className={styles.eigth} path={`/stories/${item.category}/${item.slug?.current}`}>
          <Comp storyType={item.type} desciption={text} media={media} medium={medium} />
        </AnimationLink>
      );
    }
  }
};
