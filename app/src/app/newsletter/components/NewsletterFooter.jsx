const NewsletterFooter = ({ language, site }) => {
  const logoSrc = language === "de" ? site.BMWKMS_logo_de.asset.url : site.BMWKMS_logo_en.asset.url;

  return (
    <table
      width="100%"
      border="0"
      cellPadding="0"
      cellSpacing="0"
      style={{
        backgroundColor: "#000",
        padding: "12px",
        height: "50px",
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
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "13px",
              lineHeight: "13px",
              color: "#fff",
              padding: "0",
              margin: "0",
            }}
          >
            <a
              href="https://www.pinea-periodical.com"
              target="_blank"
              style={{
                color: "#fff",
                textDecoration: "none",
              }}
            >
              Photography Intermedia Et Al.
            </a>
          </td>

          {/* SPACER (acts as the old gap: 40px) */}
          <td width="40" className="spacer" style={{ fontSize: "0", lineHeight: "0" }}>
            &nbsp;
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
                      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      fontSize: "13px",
                      lineHeight: "15px",
                      textAlign: "left",
                      paddingRight: "20px",
                      paddingBottom: "0px",
                    }}
                  >
                    <a
                      href="https://www.pinea-periodical.com/about"
                      target="_blank"
                      style={{
                        color: "#fff",
                        textDecoration: "none",
                        display: "block",
                        lineHeight: "15px",
                      }}
                    >
                      Contact
                    </a>
                    <a
                      href="https://www.pinea-periodical.com/imprint"
                      target="_blank"
                      style={{
                        color: "#fff",
                        textDecoration: "none",
                        display: "block",
                        lineHeight: "15px",
                      }}
                    >
                      Impressum
                    </a>
                  </td>

                  {/* Logo */}
                  <td
                    valign="bottom"
                    className="footer-logo-td"
                    style={{ padding: 0, margin: 0, position: "relative", width: "100%" }}
                  >
                    <a
                      href="https://www.bmwkms.gv.at/"
                      target="_blank"
                      style={{
                        textDecoration: "none",
                        position: "absolute",
                        right: "0px",
                        bottom: "0px",
                      }}
                    >
                      <img
                        src={logoSrc}
                        alt="Logo"
                        border="0"
                        style={{
                          display: "block",
                          height: "36px",
                          lineHeight: "0",
                          border: "0",
                          margin: "0",
                          padding: "0",
                          position: "relative",
                          bottom: "-3px",
                        }}
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
