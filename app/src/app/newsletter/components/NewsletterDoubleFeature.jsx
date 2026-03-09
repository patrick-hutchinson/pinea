import NewsletterFeature from "./NewsletterFeature";

const NewsletterDoubleFeature = ({ block, language }) => {
  const story = Array.isArray(block?.story) ? block.story : [];

  return (
    <>
      <style>{`
        @media only screen and (min-width: 601px) {
          .newsletter-double-feature-row .newsletter-feature-col {
            display: table-cell !important;
            width: 50% !important;
            padding-bottom: 0 !important;
          }
          .newsletter-double-feature-row .newsletter-feature-first {
            padding-right: 1px !important;
            padding-left: 0 !important;
          }
          .newsletter-double-feature-row .newsletter-feature-last {
            padding-left: 1px !important;
            padding-right: 0 !important;
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
                isFirst={index === 0}
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
