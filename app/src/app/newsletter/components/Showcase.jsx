import NewsletterPortableText from "./NewsletterPortableText";

const Showcase = ({ block }) => {
  const showcaseLabel = typeof block?.label === "string" ? block.label.trim() : "";
  const hasImageLink = typeof block?.imageLink === "string" && block.imageLink.trim().length > 0;
  const copyrightText = typeof block?.copyright === "string" ? block.copyright.trim() : "";
  const displaySmallImage = Boolean(block?.displaySmallImage);
  const imageElement = hasImageLink ? (
    <a href={block.imageLink} target="_blank" rel="noopener noreferrer">
      <img src={block.image.url} alt="" border="0" style={{ display: "block", width: "100%", height: "auto", margin: "0 auto" }} />
    </a>
  ) : (
    <img src={block.image.url} alt="" border="0" style={{ display: "block", width: "100%", height: "auto", margin: "0 auto" }} />
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
            width: 68% !important;
            min-width: 350px !important;
            max-width: 520px !important;
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
      <table className="newsletter-showcase" role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
      <tbody>
        <tr>
          <td
            className="newsletter-module-gap-bottom newsletter-showcase-content"
            style={{ padding: "0 30px", lineHeight: "1.4", maxWidth: "600px", margin: "0 auto", paddingBottom: "75px" }}
          >
            <table
              className="newsletter-showcase-inner"
              role="presentation"
              width="100%"
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
                            <td align="center" valign="middle" style={{ textAlign: "center", verticalAlign: "middle", padding: 0 }}>
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
                    <div className="newsletter-showcase-running-copy" style={{ marginTop: "12px", fontSize: "13px", lineHeight: "15px" }}>
                      <NewsletterPortableText value={block.text} style={{ fontSize: "13px", lineHeight: "15px" }} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    </>
  );
};

export default Showcase;
