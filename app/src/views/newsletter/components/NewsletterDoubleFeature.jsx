import NewsletterFeature from "./NewsletterFeature";

const listmonkSafe = (html) =>
  `{{ Safe ${JSON.stringify(html).replace(/</g, "\\x3c").replace(/>/g, "\\x3e")} }}`;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

// Outlook's content area is 704px after the shell's 8px gutters. Use physical
// column widths so Word cannot resolve the two 50% cells differently.
const OUTLOOK_DOUBLE_FEATURE_WIDTH = 704;
const OUTLOOK_FEATURE_TILE_WIDTH = OUTLOOK_DOUBLE_FEATURE_WIDTH / 2;

const NewsletterDoubleFeature = ({ block, language }) => {
  const story = Array.isArray(block?.story) ? block.story : [];
  const sectionHeader =
    typeof block?.sectionHeader === "string" ? block.sectionHeader.trim().toLocaleUpperCase(language) : "";

  return (
    <>
      <span
        dangerouslySetInnerHTML={{
          __html: listmonkSafe(`<!--[if mso]><style type="text/css">
            table.doubleFeature {
              width: ${OUTLOOK_DOUBLE_FEATURE_WIDTH}px !important;
              table-layout: fixed !important;
              border-collapse: collapse !important;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
            }
            table.doubleFeature td.newsletter-double-feature-col {
              display: table-cell !important;
              width: ${OUTLOOK_FEATURE_TILE_WIDTH}px !important;
              min-width: ${OUTLOOK_FEATURE_TILE_WIDTH}px !important;
              max-width: ${OUTLOOK_FEATURE_TILE_WIDTH}px !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            table.doubleFeature td.newsletter-double-feature-col.is-first {
              padding-bottom: 1px !important;
            }
          </style><![endif]-->`),
        }}
      />
      <style>{`
        @media only screen and (min-width: 601px) {
          .newsletter-double-feature-col {
            display: table-cell !important;
            width: 50% !important;
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

          .newsletter-double-feature-col .newsletter-feature-tile,
          .newsletter-double-feature-col .newsletter-feature-tile-row,
          .newsletter-double-feature-col .newsletter-feature-tile-cell,
          .newsletter-double-feature-col .newsletter-feature-small-canvas,
          .newsletter-double-feature-col .newsletter-feature-small-canvas-row,
          .newsletter-double-feature-col .newsletter-feature-small-canvas-cell,
          .newsletter-double-feature-col .newsletter-feature-full-canvas,
          .newsletter-double-feature-col .newsletter-feature-full-canvas-cell,
          .newsletter-double-feature-col .newsletter-feature-title-canvas {
            height: 500px !important;
            min-height: 500px !important;
          }

          .newsletter-double-feature-col .newsletter-feature-title-cell {
            height: 476px !important;
            min-height: 476px !important;
          }

          .newsletter-double-feature-col .newsletter-feature-small-image {
            width: auto !important;
            max-width: 80% !important;
            height: auto !important;
            max-height: 400px !important;
          }
        }
      `}</style>
      {sectionHeader && (
        <>
          <span dangerouslySetInnerHTML={{ __html: listmonkSafe("<!--[if !mso]><!-->") }} />
          <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
            <tbody>
              <tr>
                <td
                  className="newsletter-running-copy newsletter-bulletin-section-title"
                  style={{ width: "100%", textAlign: "center", paddingBottom: "24px", fontSize: "16px", lineHeight: "18px" }}
                >
                  {sectionHeader}
                </td>
              </tr>
            </tbody>
          </table>
          <span dangerouslySetInnerHTML={{ __html: listmonkSafe("<!--<![endif]-->") }} />
          <span
            dangerouslySetInnerHTML={{
              __html: listmonkSafe(
                `<!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="newsletter-bulletin-section-title" align="center" height="21" style="height:21px;padding:0;font-size:19px;line-height:21px;mso-line-height-rule:exactly;text-align:center;">${escapeHtml(sectionHeader)}</td></tr><tr><td height="10" style="height:10px;padding:0;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr></table><![endif]-->`,
              ),
            }}
          />
        </>
      )}
      <table className="doubleFeature" width="100%" cellPadding="0" cellSpacing="0" role="presentation" border="0" style={{ margin: 0, border: 0 }}>
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
                  // Mobile-safe base markup for Gmail clients that ignore media queries.
                  display: "block",
                  width: "100%",
                  paddingRight: 0,
                  paddingLeft: 0,
                  // Gmail mobile can ignore the responsive rule below, so the
                  // base stacked layout carries the intended inter-feature gap.
                  paddingBottom: index === story.length - 1 ? 0 : "24px",
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
