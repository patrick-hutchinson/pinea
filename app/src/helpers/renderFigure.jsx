import { lookUpAttributes } from "@/helpers/lookUpAttributes";

import { translate } from "@/helpers/translate";

import { Figure } from "@/components/Figure/Figure";

import ShrinkShowcase from "@/components/Showcase/ShrinkShowcase";
import Text from "@/components/Text/Text";

import figureStyles from "@/components/Figure/Figure.module.css";

export const renderFigure = (figure, index) => {
  const { size, item } = figure;
  const { title, text, media, medium } = lookUpAttributes(item);

  const key = item._id;

  const isPortfolio = item.type === "portfolio";
  const isPerson = item.type === "person";

  const displayCategory =
    item.category === "spot-on" ? "spot on" : item.category === "people" ? "people" : item.category;

  switch (size) {
    case "full":
      return (
        <Figure
          key={key}
          storyType={displayCategory}
          title={title}
          desciption={text}
          media={media}
          medium={medium}
          mediaPairImage={true}
          className={`${figureStyles.full} ${item.category}`}
          path={`/stories/${item.category}/${item.slug?.current}`}
        />
      );
    case "half":
      return (
        <Figure
          key={key}
          storyType={displayCategory}
          title={title}
          desciption={text}
          media={media}
          medium={medium}
          mediaPairImage={true}
          className={`${figureStyles.half} ${item.category}`}
          path={`/stories/${item.category}/${item.slug?.current}`}
        />
      );
    case "quarter":
      const Comp = isPortfolio ? ShrinkShowcase : Figure;

      return (
        <Comp
          key={key}
          storyType={displayCategory.charAt(0).toUpperCase() + item.category.slice(1)}
          title={title}
          desciption={text}
          media={media}
          medium={medium}
          caption={<Text text={translate(item.name.toUpperCase())} />}
          className={`${figureStyles.quarter} ${item.category}`}
          path={`/stories/${item.category}/${item.slug?.current}`}
        />
      );
    case "eigth": {
      const Comp = isPortfolio || isPerson ? ShrinkShowcase : Figure;

      return (
        <Comp
          key={key}
          storyType={displayCategory.charAt(0).toUpperCase() + item.category.slice(1)}
          desciption={text}
          media={media}
          medium={medium}
          caption={<Text text={translate(item.name.toUpperCase())} />}
          className={`${figureStyles.eigth} ${item.category}`}
          path={`/stories/${item.category}/${item.slug?.current}`}
        />
      );
    }
  }
};
