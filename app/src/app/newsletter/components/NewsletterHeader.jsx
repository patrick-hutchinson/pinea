const NewsletterHeader = ({ newsletter }) => {
  return (
    <table
      className="newsletter-header"
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
            valign="top"
            style={{
              fontSize: "13px",
              lineHeight: "13px",
              color: "#fff",
              padding: "0",
              margin: "0",
              width: "80%",
            }}
          >
            P.IN.E.A Periodical
          </td>

          {/* RIGHT SIDE */}
          {/* <td align="right" valign="top" className="mobile-footer-links" style={{ border: "none", padding: "0px" }}>
            <div style={{ fontSize: "13px", lineHeight: "13px", color: "#fff", padding: "0", margin: "0" }}>
              {newsletter.release}
            </div>
          </td> */}

          <td
            align="right"
            valign="center"
            className="mobile-footer-links"
            style={{ border: "none", padding: "0px", position: "relative", width: "100%" }}
          >
            <table border="0" cellPadding="0" cellSpacing="0" style={{ border: "0" }}>
              <tbody>
                <tr>
                  <td
                    valign="center"
                    className="footer-links-td newsletter-release"
                    style={{
                      fontSize: "13px",
                      lineHeight: "13px",
                      textAlign: "left",
                      padding: "0",
                    }}
                  >
                    <div style={{ color: "#fff" }}>{newsletter.release}</div>
                  </td>

                  {/* Logo */}
                  <td
                    valign="center"
                    align="right"
                    style={{ padding: 0, margin: 0, position: "relative", width: "100%" }}
                  >
                    <div
                      className="menu-button"
                      style={{
                        width: "calc(19px / 1.2)",
                        height: "19px",
                        background: "#fff",
                        // position: "absolute",
                        // right: "0px",
                        // top: "-4.5px",
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
  );
};

export default NewsletterHeader;
