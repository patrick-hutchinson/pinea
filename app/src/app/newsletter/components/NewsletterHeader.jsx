const NewsletterHeader = ({ newsletter }) => {
  return (
    <>
      <style>{`
        .newsletter-header .header-gutter {
          padding: 8px !important;
        }

        @media only screen and (min-width: 601px) {
          .newsletter-header .header-gutter {
            padding: 12px !important;
          }
        }
      `}</style>
      <table
      className="newsletter-header"
      width="100%"
      border="0"
      cellPadding="0"
      cellSpacing="0"
      style={{
        backgroundColor: "#fff",
        height: "50px",
        border: "0px",
      }}
    >
      <tbody>
        <tr>
          <td className="header-gutter" style={{ padding: "8px" }}>
            <table border="0" cellPadding="0" cellSpacing="0" style={{ border: "0", width: "100%" }}>
              <tbody>
                <tr>
                  {/* LEFT SIDE (Desktop only) */}
                  <td
                    align="left"
                    valign="top"
                    style={{
                      fontSize: "13px",
                      lineHeight: "13px",
                      color: "#000",
                      padding: "0",
                      margin: "0",
                      width: "73.5%",
                    }}
                  >
                    Photography Intermedia Et Al.
                  </td>

                  <td
                    align="right"
                    valign="top"
                    className="mobile-footer-links"
                    style={{ border: "none", padding: "0px", position: "relative", width: "100%" }}
                  >
                    <table border="0" cellPadding="0" cellSpacing="0" style={{ border: "0" }}>
                      <tbody>
                        <tr>
                          <td
                            valign="top"
                            className="footer-links-td newsletter-release"
                            style={{
                              fontSize: "13px",
                              lineHeight: "13px",
                              textAlign: "left",
                              padding: "0",
                            }}
                          >
                            <div style={{ color: "#000" }}>{newsletter.release}</div>
                          </td>

                          {/* Logo */}
                          <td
                            width="11"
                            valign="top"
                            align="right"
                            style={{ width: "11px", minWidth: "11px", maxWidth: "11px", padding: 0, margin: 0, position: "relative" }}
                          >
                            <div
                              className="menu-button"
                              style={{
                                display: "block",
                                width: "11px",
                                height: "13px",
                                background: "#000",
                              }}
                            />
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

export default NewsletterHeader;
