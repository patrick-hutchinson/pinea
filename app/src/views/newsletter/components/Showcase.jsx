import NewsletterPortableText from "./NewsletterPortableText";

// Keep Outlook-only markup inert until Listmonk evaluates Safe. Otherwise its
// HTML template parser can strip conditional comments before delivery.
const listmonkSafe = (html) => `{{ Safe ${JSON.stringify(html).replace(/</g, "\\x3c").replace(/>/g, "\\x3e")} }}`;

const Showcase = ({ block }) => {
  const showcaseLabel = typeof block?.label === "string" ? block.label.trim() : "";
  const hasImageLink = typeof block?.imageLink === "string" && block.imageLink.trim().length > 0;
  const copyrightText = typeof block?.copyright === "string" ? block.copyright.trim() : "";
  const displaySmallImage = Boolean(block?.displaySmallImage);
  const imageElement = hasImageLink ? (
    <a href={block.imageLink} target="_blank" rel="noopener noreferrer">
      <img
        className={displaySmallImage ? undefined : "newsletter-showcase-full-image"}
        src={block.image.url}
        alt=""
        width={displaySmallImage ? 220 : 464}
        border="0"
        style={{ display: "block", width: "100%", height: "auto", margin: "0 auto" }}
      />
    </a>
  ) : (
    <img
      className={displaySmallImage ? undefined : "newsletter-showcase-full-image"}
      src={block.image.url}
      alt=""
      width={displaySmallImage ? 220 : 464}
      border="0"
      style={{ display: "block", width: "100%", height: "auto", margin: "0 auto" }}
    />
  );

  return (
    <>
      <style>{`
        @media only screen and (min-width: 601px) {
          .newsletter-showcase .newsletter-showcase-content {
            padding-left: 120px !important;
            padding-right: 120px !important;
          }

          .newsletter-showcase .newsletter-showcase-inner {
            width: 100% !important;
          }

          .newsletter-showcase .newsletter-showcase-running-copy,
          .newsletter-showcase .newsletter-showcase-running-copy p {
            font-size: 15px !important;
            line-height: 18px !important;
          }

          .newsletter-showcase .newsletter-showcase-small-image-inner {
            width: 300px !important;
            max-width: 300px !important;
          }

          .newsletter-showcase .newsletter-showcase-small-image-wrap {
            height: 500px !important;
          }
        }
      `}</style>
      <table className="newsletter-showcase" role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0" align="center">
        <tbody>
          <tr>
            <td
              className="newsletter-module-gap-bottom newsletter-showcase-content"
              align="center"
              style={{ padding: "0 30px", lineHeight: "1.4", maxWidth: "720px", margin: "0 auto", paddingBottom: "75px" }}
            >
              <span
                dangerouslySetInnerHTML={{
                  // Word ignores max-width and can resolve nested 100% tables against
                  // the wrong ancestor. A physical table keeps every Showcase child aligned.
                  __html: listmonkSafe(
                    '<!--[if mso]><table role="presentation" width="464" cellpadding="0" cellspacing="0" border="0" align="center" style="width:464px;border:0;"><tr><td style="padding:0;"><![endif]-->',
                  ),
                }}
              />
              <table
                className="newsletter-showcase-inner"
                role="presentation"
                width="464"
                cellPadding="0"
                cellSpacing="0"
                border="0"
                align="center"
                style={{ width: "100%", margin: "0 auto", border: 0 }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: 0 }}>
                      {showcaseLabel && (
                        <p
                          style={{
                            margin: "0 0 6px 0",
                            lineHeight: 1,
                            fontWeight: "normal",
                            fontSize: "7.5px",
                            textTransform: "uppercase",
                          }}
                        >
                          {showcaseLabel}
                        </p>
                      )}
                      {displaySmallImage ? (
                        <table
                          className="newsletter-showcase-small-image-wrap"
                          role="presentation"
                          width="100%"
                          cellPadding="0"
                          cellSpacing="0"
                          border="0"
                          style={{
                            width: "100%",
                            height: "320px",
                            background: "#000000",
                            margin: 0,
                            padding: 0,
                          }}
                        >
                          <tbody>
                            <tr>
                              <td
                                align="center"
                                valign="middle"
                                style={{ textAlign: "center", verticalAlign: "middle", padding: 0 }}
                              >
                                <table
                                  className="newsletter-showcase-small-image-inner"
                                  role="presentation"
                                  width="220"
                                  cellPadding="0"
                                  cellSpacing="0"
                                  border="0"
                                  align="center"
                                  style={{ width: "60%", maxWidth: "220px", margin: "0 auto", border: 0 }}
                                >
                                  <tbody>
                                    <tr>
                                      <td align="center" style={{ padding: 0 }}>
                                        {imageElement}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      ) : (
                        imageElement
                      )}
                      {copyrightText && (
                        <p
                          style={{
                            margin: "6px 0 12px 0",
                            lineHeight: 1,
                            fontWeight: "normal",
                            fontSize: "7.5px",
                          }}
                        >
                          {copyrightText}
                        </p>
                      )}
                      <div
                        className="newsletter-showcase-running-copy"
                        style={{ marginTop: "24px", fontSize: "13px", lineHeight: "15px" }}
                      >
                        <NewsletterPortableText value={block.text} style={{ fontSize: "13px", lineHeight: "15px" }} />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <span
                dangerouslySetInnerHTML={{
                  __html: listmonkSafe("<!--[if mso]></td></tr></table><![endif]-->"),
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Showcase;
