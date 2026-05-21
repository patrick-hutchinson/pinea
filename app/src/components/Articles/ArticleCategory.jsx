import Text from "@/components/Text/Text";

const ArticleCategory = ({ articleCategory, className }) => {
  const formatType = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase
      .replace(/[-_]/g, " ") // replace separators with spaces
      .trim()
      .split(/\s+/) // split into words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1)) // capitalize first letter
      .join(" "); // join back into string
  };

  return <Text text={formatType(articleCategory)} className={className} />;
};

export default ArticleCategory;
