import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

const ArticleAuthor = ({ article, className }) => {
  let { language } = useContext(LanguageContext);

  console.log(article, "article");

  const Authors = () => {
    if (!article.author) return null;

    const authors = Array.isArray(article.author) ? article.author : [article.author];

    return (
      <>
        {authors.map((author, index) => (
          <span key={index}>{typeof author === "string" ? author : author.name}</span>
        ))}
      </>
    );
  };

  return (
    <div className={className}>
      {language === "en" ? "by" : "von"} <Authors />
    </div>
  );
};

export default ArticleAuthor;
