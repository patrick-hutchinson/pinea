import { lookUpAttributes } from "@/helpers/lookUpAttributes";

import AnimationLink from "@/components/AnimationLink/AnimationLink";
import FullFigure from "@/components/Figures/FullFigure/FullFigure";
import HalfFigure from "@/components/Figures/HalfFigure/HalfFigure";
import QuarterFigure from "@/components/Figures/QuarterFigure/QuarterFigure";
import EigthFigure from "@/components/Figures/EigthFigure/EigthFigure";

import styles from "../OverviewPage.module.css";

export const renderFigure = (figure, index) => {
  const { size, item } = figure;
  const { title, text, media, medium } = lookUpAttributes(item);

  switch (size) {
    case "full":
      return (
        <AnimationLink key={index} className={styles.full} path={`/stories/${item.category}/${item.slug?.current}`}>
          <FullFigure title={title} desciption={text} media={media} medium={medium} />
        </AnimationLink>
      );
    case "half":
      return (
        <AnimationLink key={index} className={styles.half} path={`/stories/${item.category}/${item.slug?.current}`}>
          <HalfFigure title={title} desciption={text} media={media} medium={medium} />
        </AnimationLink>
      );
    case "quarter":
      return (
        <AnimationLink key={index} className={styles.quarter} path={`/stories/${item.category}/${item.slug?.current}`}>
          <QuarterFigure title={title} desciption={text} media={media} medium={medium} />
        </AnimationLink>
      );
    case "eigth":
      return (
        <AnimationLink key={index} className={styles.eigth} path={`/stories/${item.category}/${item.slug?.current}`}>
          <EigthFigure title={title} desciption={text} media={media} medium={medium} />
        </AnimationLink>
      );
  }
};
