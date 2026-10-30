import NewsletterFeature from "./NewsletterFeature";

// Word expands the two 50% cells to 368px in the 720px newsletter shell.
// Keep the VML background and its Sanity crop aligned to that rendered width.
const OUTLOOK_FEATURE_TILE_WIDTH = 368;

const NewsletterDoubleFeature = ({ block, language }) => {
  const story = Array.isArray(block?.story) ? block.story : [];

  return (
    <>
      <style>{`
        @media only screen and (max-width: 600px) {
          .newsletter-double-feature-col {
            display: block !important;
            width: 100% !important;
            vertical-align: top !important;
          }
          .newsletter-double-feature-col.is-first {
            padding-right: 0 !important;
            padding-bottom: 24px !important;
          }
          .newsletter-double-feature-col.is-last {
            padding-left: 0 !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
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
                width="352"
                valign="top"
                style={{
                  border: 0,
                  display: "block",
                  width: "50%",
                  display: "table-cell",
                  paddingRight: 0,
                  paddingLeft: 0,
                  paddingBottom: index === story.length - 1 ? 0 : "1px",
                }}
              >
                <NewsletterFeature
                  feature={feature}
                  language={language}
                  outlookTileWidth={OUTLOOK_FEATURE_TILE_WIDTH}
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
