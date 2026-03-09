const NewsletterFooter = ({ language }) => {
  const gap = 10;
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
      style={{ backgroundColor: "#000000", border: 0 }}
    >
      <tbody>
        <tr>
          <td style={{ padding: "8px" }}>
            <table role="presentation" width="100%" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0 }}>
              <tbody>
                <tr>
                  <td
                    align="left"
                    valign="bottom"
                    style={{
                      fontSize: "13px",
                      lineHeight: "13px",
                      color: "#fff",
                      padding: 0,
                      width: "50%",
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

                  <td align="right" valign="bottom" style={{ padding: 0, width: "50%" }}>
                    <table role="presentation" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0, marginLeft: "auto" }}>
                      <tbody>
                        <tr>
                          <td valign="bottom" style={{ padding: `0 ${gap}px 0 0`, textAlign: "left" }}>
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
      </tbody>
    </table>
  );
};

export default NewsletterFooter;
