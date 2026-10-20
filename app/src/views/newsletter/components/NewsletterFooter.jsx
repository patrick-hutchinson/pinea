const NewsletterFooter = ({ language }) => {
  const logoSrc =
    language === "de"
      ? "https://www.pinea-periodical.com/logos/BMWKMS_de.png"
      : "https://www.pinea-periodical.com/logos/BMWKMS_en.png";

  const linkStyle = { color: "#fff", textDecoration: "none", fontSize: "13px", lineHeight: "13px" };
  const logoGap = <td width="10" style={{ width: "10px", fontSize: "1px", lineHeight: "1px", padding: 0 }}>&nbsp;</td>;

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
                  <td align="left" valign="top" style={{ width: "50%", padding: 0, color: "#fff", fontSize: "13px", lineHeight: "13px" }}>
                    <a href={`https://www.pinea-periodical.com/${language}`} target="_blank" rel="noreferrer" style={linkStyle}>
                      P.IN.E.A Periodical
                    </a>
                  </td>
                  <td align="right" valign="top" style={{ width: "50%", padding: 0, color: "#fff", fontSize: "13px", lineHeight: "13px" }}>
                    <a href="mailto:office@pinea-periodical.com" target="_blank" rel="noreferrer" style={linkStyle}>
                      {language === "en" ? "Contact" : "Kontakt"}
                    </a>
                    <br />
                    <a href="https://www.instagram.com/p.in.e.a/" target="_blank" rel="noreferrer" style={linkStyle}>
                      Instagram
                    </a>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" align="right" style={{ padding: "8px 0 0 0" }}>
                    <table role="presentation" width="280" border="0" cellPadding="0" cellSpacing="0" align="right" style={{ width: "280px", border: 0 }}>
                      <tbody>
                        <tr>
                          <td width="120" valign="bottom" style={{ width: "120px", padding: 0 }}>
                            <a href="https://www.noe.gv.at/noe/Kunst-Kultur/Kunst___Kultur.html" target="_blank" rel="noreferrer">
                              <img src="https://preview.pinea-periodical.com/logos/kulturland_schwarz-weiss.jpg" alt="Kulturland Niederösterreich" width="120" border="0" style={{ display: "block", width: "120px", height: "auto", border: 0 }} />
                            </a>
                          </td>
                          {logoGap}
                          <td width="80" valign="bottom" style={{ width: "80px", padding: 0 }}>
                            <a href="https://www.bmwkms.gv.at/" target="_blank" rel="noreferrer">
                              <img src={logoSrc} alt="BMWKMS" width="80" border="0" style={{ display: "block", width: "80px", height: "auto", border: 0 }} />
                            </a>
                          </td>
                          {logoGap}
                          <td width="60" valign="bottom" style={{ width: "60px", padding: 0 }}>
                            <a href="https://www.wien.gv.at" target="_blank" rel="noreferrer">
                              <img src="https://www.pinea-periodical.com/logos/Stadt_Wien_Kultur_neg_rgb.png" alt="Stadt Wien" width="60" border="0" style={{ display: "block", width: "60px", height: "auto", border: 0 }} />
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
