const NewsletterHeader = ({ newsletter }) => {
  return (
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
            <td style={{ padding: "8px" }}>
              <table border="0" cellPadding="0" cellSpacing="0" style={{ border: "0", width: "100%" }}>
                <tbody>
                  <tr>
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

                    <td align="right" valign="top" style={{ border: "none", padding: "0px", position: "relative", width: "100%" }}>
                      <table border="0" cellPadding="0" cellSpacing="0" style={{ border: "0" }}>
                        <tbody>
                          <tr>
                            <td
                              valign="top"
                              style={{
                                fontSize: "13px",
                                lineHeight: "13px",
                                textAlign: "left",
                                padding: "0",
                              }}
                            >
                              <div style={{ color: "#000" }}>{newsletter.release}</div>
                            </td>

                            <td valign="top" align="right" style={{ padding: 0, margin: 0, position: "relative", width: "100%" }}>
                              <div
                                style={{
                                  width: "calc(13px / 1.2)",
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
  );
};

export default NewsletterHeader;
