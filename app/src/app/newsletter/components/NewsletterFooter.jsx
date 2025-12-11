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
          {/* LEFT SIDE */}
          <td
            align="left"
            valign="bottom"
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
          <td width="40" style={{ fontSize: "0", lineHeight: "0" }}>
            &nbsp;
          </td>

          {/* RIGHT SIDE */}
          <td align="right" valign="bottom">
            <table border="0" cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  {/* Contact links */}
                  <td
                    valign="bottom"
                    style={{
                      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      fontSize: "13px",
                      lineHeight: "15px",
                      textAlign: "left",
                      paddingRight: "20px",
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
                  <td valign="bottom" style={{ padding: 0, margin: 0 }}>
                    <a href="https://www.bmwkms.gv.at/" target="_blank" style={{ textDecoration: "none" }}>
                      <img
                        src={logoSrc}
                        alt="Logo"
                        border="0"
                        style={{
                          display: "block",
                          height: "40px",
                          lineHeight: "0",
                          border: "0",
                          margin: "0",
                          padding: "0",
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
