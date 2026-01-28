import NewsletterFeature from "./NewsletterFeature";

const NewsletterDoubleFeature = ({ block, language }) => {
  return (
    <table
      className="doubleFeature"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={{ marginBottom: "150px", marginTop: "150px", border: 0 }}
    >
      {block.story.map((feature) => (
        <NewsletterFeature feature={feature} />
      ))}
    </table>
  );
};

export default NewsletterDoubleFeature;
