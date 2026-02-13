import { convertToPlainText } from "@/helpers/convertToPlainText";

import { translate } from "@/helpers/translate";

const ArticleTitle = ({ article, className }) => {
  console.log(article, "type");
  const isPortfolio = article._type === "portfolio";

  const text = isPortfolio
    ? `${article.name}: ${convertToPlainText(translate(article.teaser))}`
    : convertToPlainText(translate(article.title));

  return <div className={className}>{text}</div>;
};

export default ArticleTitle;
