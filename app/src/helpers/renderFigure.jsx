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
          <DefaultFigure
            storyType={item.category}
            title={title}
            desciption={text}
            media={media}
            medium={medium}
            mediaPairImage={true}
          />
        </AnimationLink>
      );
    case "half":
      return (
        <AnimationLink key={index} className={styles.half} path={`/stories/${item.category}/${item.slug?.current}`}>
          <DefaultFigure
            storyType={item.category}
            title={title}
            desciption={text}
            media={media}
            medium={medium}
            mediaPairImage={true}
          />
        </AnimationLink>
      );
    case "quarter":
      const Comp = isPortfolio ? BlurSpotlightShrink : DefaultFigure;

      return (
        <AnimationLink key={index} className={styles.quarter} path={`/stories/${item.category}/${item.slug?.current}`}>
          <Comp
            storyType={item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            title={title}
            desciption={text}
            media={media}
            medium={medium}
            caption={<Text text={translate(item.name.toUpperCase())} />}
          />
        </AnimationLink>
      );
    case "eigth": {
      const Comp = isPortfolio ? BlurSpotlightShrink : DefaultFigure;

      return (
        <AnimationLink key={index} className={styles.eigth} path={`/stories/${item.category}/${item.slug?.current}`}>
          <Comp
            storyType={item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            desciption={text}
            media={media}
            medium={medium}
            caption={<Text text={translate(item.name.toUpperCase())} />}
          />
        </AnimationLink>
      );
    }
  }
};
