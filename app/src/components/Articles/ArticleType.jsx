import Text from "@/components/Text/Text";

const ArticleType = ({ article, className }) => {
  const formatType = (str) => {
    if (!str) return "";
    return str
      .replace(/-/g, " ") // replace hyphens with spaces
      .split(" ") // split into words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1)) // capitalize first letter
      .join(" "); // join back into string
  };

  return <Text text={formatType(article.category)} className={className} />;
};

export default ArticleType;
