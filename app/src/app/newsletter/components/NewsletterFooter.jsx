const NewsletterFooter = ({ language, site }) => {
  const logoSrc =
    language === "de"
      ? "https://www.pinea-periodical.com/logos/BMWKMS_de.png"
      : "https://www.pinea-periodical.com/logos/BMWKMS_en.png";

  return (
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
                <tr>
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
                            <table role="presentation" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0 }}>
                              <tbody>
                                <tr>
                                  <td style={{ padding: 0 }}>
                                    <a
                                      href="mailto:office@pinea-periodical.com"
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        color: "#fff",
                                        textDecoration: "none",
                                        lineHeight: "15px",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {language === "en" ? "Contact" : "Kontakt"}
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td style={{ padding: 0 }}>
                                    <a
                                      href="https://www.instagram.com/p.in.e.a/"
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        color: "#fff",
                                        textDecoration: "none",
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

                          <td valign="middle" align="right" style={{ padding: "0 10px 0 0" }}>
                            <a href="https://www.bmwkms.gv.at/" target="_blank" rel="noreferrer">
                              <img src={logoSrc} alt="BMWKMS" height="36" style={{ display: "block", border: 0, width: "auto" }} />
                            </a>
                          </td>

                          <td valign="middle" align="right" style={{ padding: "0 10px 0 0" }}>
                            <a href="https://www.wien.gv.at" target="_blank" rel="noreferrer">
                              <img
                                src="https://www.pinea-periodical.com/logos/Stadt_Wien_Kultur_neg_rgb.png"
                                alt="Stadt Wien"
                                height="25"
                                style={{ display: "block", border: 0, width: "auto" }}
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
  );
};

export default NewsletterFooter;
