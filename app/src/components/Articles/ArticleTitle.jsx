import { convertToPlainText } from "@/helpers/convertToPlainText";

import { translate } from "@/helpers/translate";

const ArticleTitle = ({ article, className }) => {
  const isPortfolio = article.category === "portfolios";

  const text = isPortfolio
    ? `${article.name}: ${convertToPlainText(translate(article.teaser))}`
    : convertToPlainText(translate(article.title));

  return <div className={className}>{text}</div>;
};

export default ArticleTitle;
