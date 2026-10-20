const NewsletterFooter = ({ language }) => {
  const gap = 10;
  const linksWidth = 78;
  const logoZeroWidth = 120;
  const logoOneWidth = 80;
  const logoTwoWidth = 60;
  const rightBlockWidth = linksWidth + logoZeroWidth + logoOneWidth + logoTwoWidth + gap * 3;
  const logoSrc =
    language === "de"
      ? "https://www.pinea-periodical.com/logos/BMWKMS_de.png"
      : "https://www.pinea-periodical.com/logos/BMWKMS_en.png";
  const linkStyle = { color: "#fff", textDecoration: "none", fontSize: "13px", lineHeight: "13px" };
  const gapCell = <td width={gap} style={{ width: `${gap}px`, fontSize: "1px", lineHeight: "1px", padding: 0 }}>&nbsp;</td>;

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
                  <td align="left" valign="bottom" style={{ padding: 0, color: "#fff", fontSize: "13px", lineHeight: "13px" }}>
                    <a href={`https://www.pinea-periodical.com/${language}`} target="_blank" rel="noreferrer" style={linkStyle}>
                      P.IN.E.A
                    </a>
                  </td>
                  <td align="right" valign="bottom" width={rightBlockWidth} style={{ width: `${rightBlockWidth}px`, padding: 0 }}>
                    <table role="presentation" width={rightBlockWidth} border="0" cellPadding="0" cellSpacing="0" align="right" style={{ width: `${rightBlockWidth}px`, border: 0 }}>
                      <tbody>
                        <tr>
                          <td width={linksWidth} valign="bottom" style={{ width: `${linksWidth}px`, padding: 0 }}>
                            <a href="mailto:office@pinea-periodical.com" target="_blank" rel="noreferrer" style={{ ...linkStyle, display: "block" }}>
                              {language === "en" ? "Contact" : "Kontakt"}
                            </a>
                            <a href="https://www.instagram.com/p.in.e.a/" target="_blank" rel="noreferrer" style={{ ...linkStyle, display: "block" }}>
                              Instagram
                            </a>
                          </td>
                          {gapCell}
                          <td width={logoZeroWidth} valign="bottom" style={{ width: `${logoZeroWidth}px`, padding: 0 }}>
                            <a href="https://www.noe.gv.at/noe/Kunst-Kultur/Kunst___Kultur.html" target="_blank" rel="noreferrer">
                              <img src="https://preview.pinea-periodical.com/logos/kulturland_schwarz-weiss.jpg" alt="Kulturland Niederösterreich" width={logoZeroWidth} border="0" style={{ display: "block", width: `${logoZeroWidth}px`, height: "auto", border: 0 }} />
                            </a>
                          </td>
                          {gapCell}
                          <td width={logoOneWidth} valign="bottom" style={{ width: `${logoOneWidth}px`, padding: 0 }}>
                            <a href="https://www.bmwkms.gv.at/" target="_blank" rel="noreferrer">
                              <img src={logoSrc} alt="BMWKMS" width={logoOneWidth} border="0" style={{ display: "block", width: `${logoOneWidth}px`, height: "auto", border: 0 }} />
                            </a>
                          </td>
                          {gapCell}
                          <td width={logoTwoWidth} valign="bottom" style={{ width: `${logoTwoWidth}px`, padding: 0 }}>
                            <a href="https://www.wien.gv.at" target="_blank" rel="noreferrer">
                              <img src="https://www.pinea-periodical.com/logos/Stadt_Wien_Kultur_neg_rgb.png" alt="Stadt Wien" width={logoTwoWidth} border="0" style={{ display: "block", width: `${logoTwoWidth}px`, height: "auto", border: 0 }} />
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
