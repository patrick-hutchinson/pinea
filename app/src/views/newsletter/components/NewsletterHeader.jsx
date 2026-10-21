// Keep markup inert until Listmonk evaluates Safe; otherwise its HTML parser sees nested VML/table tags too early.
const listmonkSafe = (html) => `{{ Safe ${JSON.stringify(html).replace(/</g, "\\x3c").replace(/>/g, "\\x3e")} }}`;

const NewsletterHeader = ({ newsletter }) => {
  return (
    <>
      <style>{`
        .newsletter-header .header-gutter {
          padding: 0 8px 8px 8px !important;
        }

        @media only screen and (min-width: 601px) {
          .newsletter-header .header-gutter {
            padding: 12px !important;
          }

          .newsletter-page-gutter {
            padding: 12px !important;
          }

          .newsletter-running-copy {
            font-size: 19px !important;
            line-height: 21px !important;
          }

          .newsletter-running-copy p {
            font-size: 19px !important;
            line-height: 21px !important;
          }

          .newsletter-bulletin-headline {
            font-size: 22px !important;
            line-height: 1 !important;
          }

          .newsletter-module-gap {
            margin-top: 120px !important;
            margin-bottom: 120px !important;
          }

          .newsletter-module-gap-bottom {
            padding-bottom: 120px !important;
          }

          .newsletter-module-gap-vertical {
            padding-top: 120px !important;
            padding-bottom: 120px !important;
          }

          .newsletter-running-gap {
            padding-bottom: 120px !important;
          }
        }
      `}</style>
      <table
      className="newsletter-header"
      width="100%"
      border="0"
      cellPadding="0"
      cellSpacing="0"
      style={{
        backgroundColor: "#fff",
        height: "50px",
        border: "0px",
      }}
    >
      <tbody>
        <tr>
          <td className="header-gutter" style={{ padding: "0 8px 8px 8px" }}>
            <table border="0" cellPadding="0" cellSpacing="0" style={{ border: "0", width: "100%" }}>
              <tbody>
                <tr>
                  {/* LEFT SIDE (Desktop only) */}
                  <td
                    align="left"
                    valign="top"
                    style={{
                      fontSize: "13px",
                      lineHeight: "13px",
                      color: "#000",
                      padding: "0",
                      margin: "0",
                      width: "73.5%",
                    }}
                  >
                    Photography Intermedia Et Al.
                  </td>

                  <td
                    align="right"
                    valign="top"
                    className="mobile-footer-links"
                    style={{ border: "none", padding: "0", width: "26.5%" }}
                  >
                    <table role="presentation" width="100%" border="0" cellPadding="0" cellSpacing="0" align="right" style={{ border: "0", width: "100%" }}>
                      <tbody>
                        <tr>
                          <td
                            align="right"
                            valign="top"
                            className="footer-links-td newsletter-release"
                            style={{
                              fontSize: "13px",
                              lineHeight: "13px",
                              textAlign: "right",
                              padding: "0 20px 0 0",
                            }}
                          >
                            <div style={{ color: "#000" }}>{newsletter.release}</div>
                          </td>

                          {/* Logo */}
                          <td
                            width="11"
                            height="13"
                            valign="top"
                            align="right"
                            style={{ width: "11px", height: "13px", lineHeight: "13px", fontSize: "0", padding: 0, margin: 0 }}
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html:
                                  listmonkSafe('<!--[if mso]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fillcolor="#000000" stroked="f" style="width:8.25pt;height:9.75pt;"></v:rect><![endif]--><!--[if !mso]><!--><span style="display:block;width:11px;height:13px;background:#000000;"></span><!--<![endif]-->'),
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
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

export default NewsletterHeader;
