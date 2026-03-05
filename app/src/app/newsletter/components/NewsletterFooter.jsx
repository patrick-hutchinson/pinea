const NewsletterFooter = ({ language, site }) => {
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
            vertical-align: top !important;
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
            <td style={{ padding: "12px" }}>
              <table role="presentation" width="100%" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0 }}>
                <tbody>
                  <tr className="footer-desktop-row">
                    <td
                      align="left"
                      valign="bottom"
                      className="desktop-logo"
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
                        style={{
                          color: "#fff",
                          textDecoration: "none",
                        }}
                      >
                        P.IN.E.A Periodical
                      </a>
                    </td>

                    <td align="right" valign="bottom" className="mobile-footer-links" style={{ border: 0, padding: 0 }}>
                      <table role="presentation" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0 }}>
                        <tbody>
                          <tr>
                            <td
                              valign="bottom"
                              className="footer-links-td"
                              style={{
                                fontSize: "13px",
                                lineHeight: "15px",
                                textAlign: "left",
                                padding: "0 20px 0 0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <a
                                href="mailto:office@pinea-periodical.com"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  color: "#fff",
                                  textDecoration: "none",
                                  display: "block",
                                  lineHeight: "15px",
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
                                  lineHeight: "15px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Instagram
                              </a>
                            </td>

                            <td valign="middle" align="right" style={{ padding: 0, width: "80px", paddingRight: "10px" }}>
                              <a href="https://www.bmwkms.gv.at/" target="_blank" rel="noreferrer">
                                <img src={logoSrc} alt="BMWKMS" width="80" height="36" style={{ display: "block", border: 0 }} />
                              </a>
                            </td>

                            <td valign="middle" align="right" style={{ padding: "0 10px 0 0", width: "60px" }}>
                              <a href="https://www.wien.gv.at" target="_blank" rel="noreferrer">
                                <img
                                  src="https://www.pinea-periodical.com/logos/Stadt_Wien_Kultur_neg_rgb.png"
                                  alt="Stadt Wien"
                                  width="60"
                                  height="25"
                                  style={{ display: "block", border: 0 }}
                                />
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr className="footer-mobile-row" style={{ display: "none", msoHide: "all" }}>
                    <td className="footer-mobile-col" width="50%" align="left" valign="top" style={{ width: "50%", padding: 0 }}>
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
                            <td style={{ fontSize: "13px", lineHeight: "15px", padding: 0 }}>
                              <a
                                href="mailto:office@pinea-periodical.com"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  color: "#fff",
                                  textDecoration: "none",
                                  display: "block",
                                  lineHeight: "15px",
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
                                  lineHeight: "15px",
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

                    <td className="footer-mobile-col" width="50%" align="right" valign="top" style={{ width: "50%", padding: 0 }}>
                      <table role="presentation" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0, marginLeft: "auto" }}>
                        <tbody>
                          <tr>
                            <td valign="middle" align="right" style={{ padding: "0 10px 0 0" }}>
                              <a href="https://www.bmwkms.gv.at/" target="_blank" rel="noreferrer">
                                <img src={logoSrc} alt="BMWKMS" width="80" height="36" style={{ display: "block", border: 0 }} />
                              </a>
                            </td>
                            <td valign="middle" align="right" style={{ padding: 0 }}>
                              <a href="https://www.wien.gv.at" target="_blank" rel="noreferrer">
                                <img
                                  src="https://www.pinea-periodical.com/logos/Stadt_Wien_Kultur_neg_rgb.png"
                                  alt="Stadt Wien"
                                  width="60"
                                  height="25"
                                  style={{ display: "block", border: 0 }}
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
