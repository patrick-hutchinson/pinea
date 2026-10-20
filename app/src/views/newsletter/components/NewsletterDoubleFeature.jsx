import NewsletterFeature from "./NewsletterFeature";

const NewsletterDoubleFeature = ({ block, language }) => {
  const story = Array.isArray(block?.story) ? block.story : [];

  return (
    <>
      <style>{`
        @media only screen and (min-width: 601px) {
          .newsletter-double-feature-col {
            display: table-cell !important;
            width: 50% !important;
            vertical-align: top !important;
          }
          .newsletter-double-feature-col.is-first {
            padding-right: 1px !important;
            padding-bottom: 0 !important;
          }
          .newsletter-double-feature-col.is-last {
            padding-left: 1px !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
      <span
        dangerouslySetInnerHTML={{
          __html:
            '<!--[if mso]><style>.newsletter-double-feature-col { display: table-cell !important; width: 50% !important; vertical-align: top !important; }</style><![endif]-->',
        }}
      />
      <table
        className="doubleFeature newsletter-module-gap"
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        border="0"
        style={{ marginBottom: "75px", marginTop: "75px", border: 0 }}
      >
        <tbody>
          <tr>
            {story.map((feature, index) => (
              <td
                key={feature?._key || feature?.href || feature?.link || feature?.featureTitle || index}
                className={`newsletter-double-feature-col ${index === 0 ? "is-first" : ""} ${
                  index === story.length - 1 ? "is-last" : ""
                }`}
                width="50%"
                valign="top"
                style={{
                  border: 0,
                  display: "block",
                  // Windows Outlook ignores the mobile stacking CSS, so retain two
                  // equal table cells there while modern clients stack them by default.
                  width: "50%",
                  paddingRight: 0,
                  paddingLeft: 0,
                  paddingBottom: index === story.length - 1 ? 0 : "1px",
                }}
              >
                <NewsletterFeature
                  feature={feature}
                  language={language}
                  isFirst={index === 0}
                  isLast={index === story.length - 1}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default NewsletterDoubleFeature;
