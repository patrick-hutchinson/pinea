import { lookUpAttributes } from "@/helpers/lookUpAttributes";

import { translate } from "@/helpers/translate";

import { Figure } from "@/components/Figure/Figure";

import ShrinkShowcase from "@/components/Showcase/ShrinkShowcase";
import Text from "@/components/Text/Text";

import figureStyles from "@/components/Figure/Figure.module.css";

export const getStoryPreviewClassName = (figure) => {
  const { size, item } = figure || {};
  const sizeClassName = figureStyles[size] || "";
  const categoryClassName = item?.category || "";

  return `${sizeClassName} ${categoryClassName}`.trim();
};

export const renderStoryPreview = (figure, index, forcedKey, classNameOverride) => {
  const { size, item } = figure;
  const { title, text, media, medium } = lookUpAttributes(item);
  const className = classNameOverride ?? getStoryPreviewClassName(figure);

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
          className={className}
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
          className={className}
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
          className={className}
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
          className={className}
          path={`/stories/${item.category}/${item.slug?.current}`}
          showShare={false}
        />
      );
    }
  }
};
