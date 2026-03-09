import NewsletterFeature from "./NewsletterFeature";

const NewsletterDoubleFeature = ({ block, language }) => {
  const story = Array.isArray(block?.story) ? block.story : [];

  return (
    <table
      className="doubleFeature"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      border="0"
      style={{ marginBottom: "150px", marginTop: "150px", border: 0 }}
    >
      <tbody>
        <tr>
          {story.map((feature, index) => (
            <NewsletterFeature
              key={feature?._key || feature?.link || feature?.featureTitle || index}
              feature={feature}
              language={language}
              isFirst={index === 0}
              isLast={index === story.length - 1}
            />
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default NewsletterDoubleFeature;
