const NewsletterFooter = ({ language, site }) => {
  const logoSrc = language === "de" ? site.BMWKMS_logo_de.asset.url : site.BMWKMS_logo_en.asset.url;
  console.log("logo:", language, logoSrc);

  return (
    <table
      className="newsletter-footer"
      width="100%"
      border="0"
      cellPadding="0"
      cellSpacing="0"
      style={{
        backgroundColor: "#000",
        padding: "12px",
        height: "50px",
        border: "0px",
      }}
    >
      <tbody>
        <tr>
          {/* LEFT SIDE (Desktop only) */}
          <td
            align="left"
            valign="bottom"
            className="desktop-logo"
            style={{
              fontSize: "13px",
              lineHeight: "13px",
              color: "#fff",
              padding: "0",
              margin: "0",
              width: "73.5%",
            }}
          >
            <a
              href={`https://www.pinea-periodical.com/#${language}`}
              target="_blank"
              style={{
                color: "#fff",
                textDecoration: "none",
              }}
            >
              P.IN.E.A Periodical
            </a>
          </td>

          {/* RIGHT SIDE */}
          <td align="right" valign="bottom" className="mobile-footer-links" style={{ border: "none", padding: "0px" }}>
            <table border="0" cellPadding="0" cellSpacing="0" style={{ border: "0" }}>
              <tbody>
                <tr>
                  {/* Contact links */}
                  <td
                    valign="bottom"
                    className="footer-links-td"
                    style={{
                      // fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      fontSize: "13px",
                      lineHeight: "15px",
                      textAlign: "left",
                      paddingRight: "20px",
                      paddingBottom: "0px",
                      padding: "0",
                    }}
                  >
                    <a
                      href="mailto:office@pinea-periodical.com"
                      target="_blank"
                      style={{
                        color: "#fff",
                        textDecoration: "none",
                        display: "block",
                        lineHeight: "15px",
                      }}
                    >
                      {language === "en" ? "Contact" : "Kontakt"}
                    </a>
                    <a
                      href="https://www.instagram.com/p.in.e.a/"
                      target="_blank"
                      style={{
                        color: "#fff",
                        textDecoration: "none",
                        display: "block",
                        lineHeight: "15px",
                      }}
                    >
                      Instagram
                    </a>
                  </td>

                  {/* Logo 1 */}
                  <td
                    valign="middle"
                    align="right"
                    style={{
                      padding: 0,
                      width: "80px",
                    }}
                  >
                    <a href="https://www.bmwkms.gv.at/" target="_blank">
                      <img src={logoSrc} alt="BMWKMS" height="36" style={{ display: "block", border: 0 }} />
                    </a>
                  </td>

                  {/* Logo 2 */}
                  <td
                    valign="middle"
                    align="right"
                    style={{
                      padding: "0 10px 0 0",
                      width: "60px",
                    }}
                  >
                    <a href="https://www.wien.gv.at" target="_blank">
                      <img
                        src="https://www.pinea-periodical.com/logos/Stadt_Wien_Kultur_neg_rgb.png"
                        alt="Stadt Wien"
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
  );
};

export default NewsletterFooter;
