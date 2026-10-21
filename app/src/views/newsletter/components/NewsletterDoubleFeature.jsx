import NewsletterFeature from "./NewsletterFeature";

const listmonkSafe = (html) => `{{ Safe ${JSON.stringify(html).replace(/</g, "\\x3c").replace(/>/g, "\\x3e")} }}`;

const OUTLOOK_FEATURE_ROW_WIDTH = 704;
const OUTLOOK_FEATURE_TILE_WIDTH = OUTLOOK_FEATURE_ROW_WIDTH / 2;
const FEATURE_TILE_HEIGHT = 500;

const NewsletterDoubleFeature = ({ block, language }) => {
  const story = Array.isArray(block?.story) ? block.story : [];

  return (
    <>
      <span
        dangerouslySetInnerHTML={{
          __html: listmonkSafe("<!--[if mso]>"),
        }}
      />
      <table
        role="presentation"
        width={OUTLOOK_FEATURE_ROW_WIDTH}
        cellPadding="0"
        cellSpacing="0"
        border="0"
        style={{ border: 0, width: `${OUTLOOK_FEATURE_ROW_WIDTH}px` }}
      >
        <tbody>
          <tr height={FEATURE_TILE_HEIGHT} style={{ height: `${FEATURE_TILE_HEIGHT}px` }}>
            {story.map((feature, index) => (
              <td
                key={`outlook-${feature?._key || feature?.href || feature?.link || feature?.featureTitle || index}`}
                width={OUTLOOK_FEATURE_TILE_WIDTH}
                height={FEATURE_TILE_HEIGHT}
                valign="top"
                style={{ border: 0, width: `${OUTLOOK_FEATURE_TILE_WIDTH}px`, height: `${FEATURE_TILE_HEIGHT}px`, padding: 0 }}
              >
                <NewsletterFeature feature={feature} language={language} outlookTileWidth={OUTLOOK_FEATURE_TILE_WIDTH} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <span
        dangerouslySetInnerHTML={{
          __html: listmonkSafe("<![endif]-->"),
        }}
      />
      <span
        dangerouslySetInnerHTML={{
          __html: listmonkSafe("<!--[if !mso]><!-->"),
        }}
      />
      <style>{`
        @media only screen and (max-width: 600px) {
          .newsletter-double-feature-col {
            display: block !important;
            width: 100% !important;
            vertical-align: top !important;
          }
          .newsletter-double-feature-col.is-first {
            padding-right: 0 !important;
            padding-bottom: 1px !important;
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
      <span
        dangerouslySetInnerHTML={{
          __html: listmonkSafe("<!--<![endif]-->"),
        }}
      />
    </>
  );
};

export default NewsletterDoubleFeature;
