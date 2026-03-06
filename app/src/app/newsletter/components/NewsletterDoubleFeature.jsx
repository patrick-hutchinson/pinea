import NewsletterFeature from "./NewsletterFeature";

const NewsletterDoubleFeature = ({ block, language }) => {
  const story = Array.isArray(block?.story) ? block.story : [];

  return (
    <>
      <style>{`
        @media only screen and (max-width: 600px) {
          .newsletter-double-feature-row .newsletter-feature-col {
            display: block !important;
            width: 100% !important;
            padding: 0 0 12px 0 !important;
          }
        }
      `}</style>
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
          <tr className="newsletter-double-feature-row">
            {story.map((feature, index) => (
              <NewsletterFeature
                key={feature?._key || feature?.link || feature?.featureTitle || index}
                feature={feature}
                language={language}
                isLast={index === story.length - 1}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default NewsletterDoubleFeature;
