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
            <table
              role="presentation"
              width="100%"
              border="0"
              cellPadding="0"
              cellSpacing="0"
              style={{ border: 0, tableLayout: "fixed" }}
            >
              <tbody>
                <tr>
                  <td
                    width="50%"
                    align="left"
                    valign="bottom"
                    className="desktop-logo"
                    style={{
                      fontSize: "13px",
                      lineHeight: "13px",
                      color: "#fff",
                      padding: "0",
                      width: "50%",
                    }}
                  >
                    <a
                      href={`https://www.pinea-periodical.com/#${language}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#fff",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      P.IN.E.A Periodical
                    </a>
                  </td>

                  <td
                    width="50%"
                    align="right"
                    valign="bottom"
                    className="mobile-footer-links"
                    style={{ border: 0, padding: 0, width: "50%" }}
                  >
                    <table role="presentation" width="100%" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0 }}>
                      <tbody>
                        <tr>
                          <td
                            valign="bottom"
                            className="footer-links-td"
                            style={{
                              fontSize: "13px",
                              lineHeight: "15px",
                              textAlign: "left",
                              padding: "0",
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
                        </tr>

                        <tr>
                          <td valign="bottom" align="right" style={{ paddingTop: "6px" }}>
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
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsletterFooter;
