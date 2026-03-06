const NewsletterFooter = ({ language, site }) => {
  const gap = 10;
  const logoSrc =
    language === "de"
      ? "https://www.pinea-periodical.com/logos/BMWKMS_de.png"
      : "https://www.pinea-periodical.com/logos/BMWKMS_en.png";

  return (
    <>
      <style>{`
        .newsletter-footer .footer-mobile-row {
          display: none;
          mso-hide: all;
        }

        .newsletter-footer .footer-gutter {
          padding: 12px !important;
        }

        @media only screen and (max-width: 600px) {
          .newsletter-footer .footer-desktop-row {
            display: none !important;
            mso-hide: all !important;
            max-height: 0 !important;
            overflow: hidden !important;
          }

          .newsletter-footer .footer-mobile-row {
            display: table-row !important;
            mso-hide: none !important;
          }

          .newsletter-footer .footer-mobile-col {
            width: 50% !important;
            vertical-align: bottom !important;
          }

          .newsletter-footer .footer-gutter {
            padding: 8px !important;
          }
        }
      `}</style>

      <table
        className="newsletter-footer"
        role="presentation"
        width="100%"
        border="0"
        cellPadding="0"
        cellSpacing="0"
        bgcolor="#000000"
        style={{
          backgroundColor: "#000",
          border: 0,
        }}
      >
        <tbody>
          <tr>
            <td className="footer-gutter">
              <table role="presentation" width="100%" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0 }}>
                <tbody>
                  <tr className="footer-desktop-row">
                    <td
                      align="left"
                      valign="top"
                      style={{
                        fontSize: "13px",
                        lineHeight: "13px",
                        color: "#fff",
                        padding: "0",
                        width: "73.5%",
                      }}
                    >
                      <a
                        href={`https://www.pinea-periodical.com/#${language}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#fff", textDecoration: "none", whiteSpace: "nowrap" }}
                      >
                        P.IN.E.A Periodical
                      </a>
                    </td>

                    <td align="right" valign="top" style={{ border: 0, padding: 0, position: "relative", width: "100%" }}>
                      <table role="presentation" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0 }}>
                        <tbody>
                          <tr>
                            <td valign="top" style={{ padding: 0, textAlign: "left", verticalAlign: "top" }}>
                              <a
                                href="mailto:office@pinea-periodical.com"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  color: "#fff",
                                  textDecoration: "none",
                                  display: "block",
                                  fontSize: "13px",
                                  lineHeight: "13px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {language === "en" ? "Contact" : "Kontakt"}
                              </a>
                              <a
                                href="https://www.instagram.com/p.in.e.a/"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  color: "#fff",
                                  textDecoration: "none",
                                  display: "block",
                                  fontSize: "13px",
                                  lineHeight: "13px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Instagram
                              </a>
                            </td>

                            <td valign="top" align="right" style={{ padding: 0, margin: 0, position: "relative", width: "100%" }}>
                              <table role="presentation" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0, marginLeft: "auto" }}>
                                <tbody>
                                  <tr>
                                    <td valign="bottom" align="right" style={{ padding: `0 ${gap}px 0 0` }}>
                                      <a href="https://www.bmwkms.gv.at/" target="_blank" rel="noreferrer">
                                        <img
                                          src={logoSrc}
                                          alt="BMWKMS"
                                          width="80"
                                          style={{ display: "block", border: 0, width: "80px", height: "auto" }}
                                        />
                                      </a>
                                    </td>

                                    <td valign="bottom" align="right" style={{ padding: 0 }}>
                                      <a href="https://www.wien.gv.at" target="_blank" rel="noreferrer">
                                        <img
                                          src="https://www.pinea-periodical.com/logos/Stadt_Wien_Kultur_neg_rgb.png"
                                          alt="Stadt Wien"
                                          width="60"
                                          style={{ display: "block", border: 0, width: "60px", height: "auto" }}
                                        />
                                      </a>
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

                  <tr className="footer-mobile-row" style={{ display: "none", msoHide: "all" }}>
                    <td className="footer-mobile-col" width="50%" align="left" valign="bottom" style={{ width: "50%", padding: 0 }}>
                      <table role="presentation" width="100%" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0 }}>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                fontSize: "13px",
                                lineHeight: "13px",
                                color: "#fff",
                                padding: 0,
                                whiteSpace: "nowrap",
                              }}
                            >
                              <a
                                href={`https://www.pinea-periodical.com/#${language}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#fff", textDecoration: "none" }}
                              >
                                P.IN.E.A Periodical
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ height: "8px", lineHeight: "8px", fontSize: "8px" }}>&nbsp;</td>
                          </tr>
                          <tr>
                            <td style={{ fontSize: "13px", lineHeight: "13px", padding: 0 }}>
                              <a
                                href="mailto:office@pinea-periodical.com"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  color: "#fff",
                                  textDecoration: "none",
                                  display: "block",
                                  fontSize: "13px",
                                  lineHeight: "13px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {language === "en" ? "Contact" : "Kontakt"}
                              </a>
                              <a
                                href="https://www.instagram.com/p.in.e.a/"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  color: "#fff",
                                  textDecoration: "none",
                                  display: "block",
                                  fontSize: "13px",
                                  lineHeight: "13px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Instagram
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>

                    <td className="footer-mobile-col" width="50%" align="right" valign="bottom" style={{ width: "50%", padding: 0 }}>
                      <table role="presentation" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0, marginLeft: "auto" }}>
                        <tbody>
                          <tr>
                            <td style={{ height: "21px", lineHeight: "21px", fontSize: "21px", padding: 0 }}>&nbsp;</td>
                          </tr>
                          <tr>
                            <td valign="bottom" align="right" style={{ padding: "0 10px 0 0" }}>
                              <a href="https://www.bmwkms.gv.at/" target="_blank" rel="noreferrer">
                                <img
                                  src={logoSrc}
                                  alt="BMWKMS"
                                  width="80"
                                  style={{ display: "block", border: 0, width: "80px", height: "auto" }}
                                />
                              </a>
                            </td>
                            <td valign="bottom" align="right" style={{ padding: 0 }}>
                              <a href="https://www.wien.gv.at" target="_blank" rel="noreferrer">
                                <img
                                  src="https://www.pinea-periodical.com/logos/Stadt_Wien_Kultur_neg_rgb.png"
                                  alt="Stadt Wien"
                                  width="60"
                                  style={{ display: "block", border: 0, width: "60px", height: "auto" }}
                                />
                              </a>
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

export default NewsletterFooter;
