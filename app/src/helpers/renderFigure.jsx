import { lookUpAttributes } from "@/helpers/lookUpAttributes";

import { translate } from "@/helpers/translate";

import AnimationLink from "@/components/AnimationLink/AnimationLink";
import DefaultFigure from "@/components/Figures/DefaultFigure";

import BlurSpotlightShrink from "@/components/BlurSpotlight/BlurSpotlightShrink";
import Text from "@/components/Text/Text";

import styles from "@/pages/OverviewPage/OverviewPage.module.css";

export const renderFigure = (figure, index) => {
  const { size, item } = figure;
  const { title, text, media, medium } = lookUpAttributes(item);

  const isPortfolio = item.type === "portfolio";

  switch (size) {
    case "full":
      return (
        <AnimationLink key={index} className={styles.full} path={`/stories/${item.category}/${item.slug?.current}`}>
          <DefaultFigure storyType={item.category} title={title} desciption={text} media={media} medium={medium} />
        </AnimationLink>
      );
    case "half":
      return (
        <AnimationLink key={index} className={styles.half} path={`/stories/${item.category}/${item.slug?.current}`}>
          <DefaultFigure storyType={item.category} title={title} desciption={text} media={media} medium={medium} />
        </AnimationLink>
      );
    case "quarter":
      const Comp = isPortfolio ? BlurSpotlightShrink : DefaultFigure;

      return (
        <AnimationLink key={index} className={styles.quarter} path={`/stories/${item.category}/${item.slug?.current}`}>
          <Comp
            storyType={item.category}
            title={title}
            desciption={text}
            media={media}
            medium={medium}
            caption={<Text text={translate(item.caption)} />}
          />
        </AnimationLink>
      );
    case "eigth": {
      const Comp = isPortfolio ? BlurSpotlightShrink : DefaultFigure;

      return (
        <AnimationLink key={index} className={styles.eigth} path={`/stories/${item.category}/${item.slug?.current}`}>
          <Comp
            storyType={item.category}
            desciption={text}
            media={media}
            medium={medium}
            caption={<Text text={translate(item.caption)} />}
          />
        </AnimationLink>
      );
    }
  }
};
