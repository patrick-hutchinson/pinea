const NewsletterFooter = ({ language }) => {
  const gap = 10;
  const linksWidth = 78;
  const logoOneWidth = 80;
  const logoTwoWidth = 60;
  const rightBlockWidth = linksWidth + logoOneWidth + logoTwoWidth + gap + gap;
  const logoSrc =
    language === "de"
      ? "https://www.pinea-periodical.com/logos/BMWKMS_de.png"
      : "https://www.pinea-periodical.com/logos/BMWKMS_en.png";

  return (
    <>
      <style>{`
        @media only screen and (min-width: 601px) {
          .newsletter-footer .footer-gutter {
            padding: 12px !important;
          }
          .newsletter-footer .footer-mobile-row {
            display: none !important;
            max-height: 0 !important;
            overflow: hidden !important;
            mso-hide: all !important;
          }
          .newsletter-footer .footer-desktop-row {
            display: table-row !important;
            max-height: none !important;
            overflow: visible !important;
            mso-hide: none !important;
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
        style={{ backgroundColor: "#000000", border: 0 }}
      >
        <tbody>
          <tr>
            <td className="footer-gutter" style={{ padding: "8px" }}>
              <table role="presentation" width="100%" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0 }}>
                <tbody>
                  <tr
                    className="footer-mobile-row"
                    style={{
                      display: "table-row",
                      maxHeight: "none",
                      overflow: "visible",
                    }}
                  >
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
                        href={`https://www.pinea-periodical.com/${language}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#fff", textDecoration: "none", whiteSpace: "nowrap" }}
                      >
                        P.IN.E.A Periodical
                      </a>
                      <div style={{ height: "8px", lineHeight: "8px", fontSize: "8px" }}>&nbsp;</div>
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

                    <td align="right" valign="bottom" style={{ padding: 0, width: "50%" }}>
                      <table role="presentation" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0, marginLeft: "auto" }}>
                        <tbody>
                          <tr>
                            <td valign="bottom" align="right" style={{ padding: 0 }}>
                              <a href="https://www.bmwkms.gv.at/" target="_blank" rel="noreferrer">
                                <img
                                  src={logoSrc}
                                  alt="BMWKMS"
                                  width="80"
                                  style={{ display: "block", border: 0, width: "80px", height: "auto" }}
                                />
                              </a>
                            </td>

                            <td width={gap} style={{ width: `${gap}px`, fontSize: "1px", lineHeight: "1px", padding: 0 }}>&nbsp;</td>

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

                  <tr
                    className="footer-desktop-row"
                    style={{
                      display: "none",
                      maxHeight: 0,
                      overflow: "hidden",
                      msoHide: "all",
                    }}
                  >
                    <td
                      align="left"
                      valign="bottom"
                      style={{
                        fontSize: "13px",
                        lineHeight: "13px",
                        color: "#fff",
                        padding: 0,
                      }}
                    >
                      <a
                        href={`https://www.pinea-periodical.com/${language}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#fff", textDecoration: "none", whiteSpace: "nowrap" }}
                      >
                        P.IN.E.A Periodical
                      </a>
                    </td>

                    <td
                      align="right"
                      valign="bottom"
                      style={{
                        padding: 0,
                        width: `${rightBlockWidth}px`,
                        minWidth: `${rightBlockWidth}px`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <table
                        role="presentation"
                        border="0"
                        cellPadding="0"
                        cellSpacing="0"
                        width={rightBlockWidth}
                        style={{ border: 0, width: `${rightBlockWidth}px`, tableLayout: "fixed" }}
                      >
                        <tbody>
                          <tr>
                            <td width={linksWidth} valign="bottom" style={{ width: `${linksWidth}px`, textAlign: "left", padding: 0, whiteSpace: "nowrap" }}>
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

                            <td width={gap} style={{ width: `${gap}px`, minWidth: `${gap}px`, fontSize: "1px", lineHeight: "1px", padding: 0 }}>
                              &nbsp;
                            </td>

                            <td width={logoOneWidth} valign="bottom" align="right" style={{ width: `${logoOneWidth}px`, padding: 0 }}>
                              <a href="https://www.bmwkms.gv.at/" target="_blank" rel="noreferrer">
                                <img
                                  src={logoSrc}
                                  alt="BMWKMS"
                                  width="80"
                                  style={{ display: "block", border: 0, width: "80px", height: "auto" }}
                                />
                              </a>
                            </td>

                            <td width={gap} style={{ width: `${gap}px`, minWidth: `${gap}px`, fontSize: "1px", lineHeight: "1px", padding: 0 }}>
                              &nbsp;
                            </td>

                            <td width={logoTwoWidth} valign="bottom" align="right" style={{ width: `${logoTwoWidth}px`, padding: 0 }}>
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
