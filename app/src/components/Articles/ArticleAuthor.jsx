import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

const ArticleAuthor = ({ article, className }) => {
  let { language } = useContext(LanguageContext);

  const resolveContributors = () => {
    const releaseContributors = article?.releaseInfo?.contributor;
    if (Array.isArray(releaseContributors) && releaseContributors.length > 0) return releaseContributors;
    if (releaseContributors) return [releaseContributors];

    const legacyAuthors = article?.author;
    if (Array.isArray(legacyAuthors) && legacyAuthors.length > 0) return legacyAuthors;
    if (legacyAuthors) return [legacyAuthors];

    return [];
  };

  const contributors = resolveContributors();
  if (contributors.length === 0) return null;

  const Authors = () => {
    return (
      <>
        {contributors.map((contributor, index) => (
          <span key={index}>{typeof contributor === "string" ? contributor : contributor.name}</span>
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
