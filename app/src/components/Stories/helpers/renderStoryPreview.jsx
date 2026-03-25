import { lookUpAttributes } from "@/helpers/lookUpAttributes";

import { translate } from "@/helpers/translate";

import { Figure } from "@/components/Figure/Figure";

import ShrinkShowcase from "@/components/Showcase/ShrinkShowcase";
import Text from "@/components/Text/Text";

import figureStyles from "@/components/Figure/Figure.module.css";

export const renderStoryPreview = (figure, index, forcedKey) => {
  const { size, item } = figure;
  const { title, text, media, medium } = lookUpAttributes(item);

  const key = forcedKey || item?._id || item?.slug?.current || `story-${index}`;

  const isPortfolio = item.type === "portfolio";
  const isPerson = item.type === "person";
  const hasName = typeof item?.name === "string" && item.name.trim().length > 0;
  const captionText = hasName ? item.name.toUpperCase() : typeof title === "string" ? title : "";

  const displayCategory =
    item.category === "spot-on" ? "spot on" : item.category === "recommended" ? "RECOMMENDED" : item.category;

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
          className={`${figureStyles.full} ${item.category}`}
          path={`/stories/${item.category}/${item.slug?.current}`}
          showShare={false}
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
          className={`${figureStyles.half} ${item.category}`}
          path={`/stories/${item.category}/${item.slug?.current}`}
          showShare={false}
        />
      );
    case "quarter":
      const Comp = isPortfolio && medium ? ShrinkShowcase : Figure;

      return (
        <Comp
          key={key}
          storyType={displayCategory.charAt(0).toUpperCase() + item.category.slice(1)}
          title={title}
          desciption={text}
          media={media}
          medium={medium}
          caption={captionText ? <Text text={translate(captionText)} /> : undefined}
          className={`${figureStyles.quarter} ${item.category}`}
          path={`/stories/${item.category}/${item.slug?.current}`}
          showShare={false}
        />
      );
    case "eigth": {
      const Comp = (isPortfolio || isPerson) && medium ? ShrinkShowcase : Figure;

      return (
        <Comp
          key={key}
          storyType={displayCategory.charAt(0).toUpperCase() + displayCategory.slice(1)}
          desciption={text}
          media={media}
          medium={medium}
          caption={captionText ? <Text text={translate(captionText)} /> : undefined}
          className={`${figureStyles.eigth} ${item.category}`}
          path={`/stories/${item.category}/${item.slug?.current}`}
          showShare={false}
        />
      );
    }
  }
};
