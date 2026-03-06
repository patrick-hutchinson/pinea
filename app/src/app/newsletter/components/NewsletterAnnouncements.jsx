const NewsletterAnnouncements = ({ block, language }) => {
  const adImage = block?.items?.[0]?.image?.url;
  const firstCardTitle = block?.items?.[1]?.title || "";
  const secondCardTitle = block?.items?.[2]?.title || "";

  return (
    <table
      className="newsletter-announcements"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      border="0"
      style={{ marginTop: "150px", marginBottom: "150px", border: 0 }}
    >
      <tbody>
        <tr>
          <td width="50%" valign="top" style={{ paddingRight: "6px" }}>
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" border="0">
              <tbody>
                <tr>
                  <td
                    style={{
                      textTransform: "uppercase",
                      fontSize: "7.5px",
                      lineHeight: "1",
                      paddingBottom: "6px",
                      textAlign: "left",
                    }}
                  >
                    Ad
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href={block?.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#000000" }}>
                      {adImage ? (
                        <img
                          src={adImage}
                          alt=""
                          border="0"
                          width="100%"
                          style={{ display: "block", width: "100%", maxWidth: "100%", height: "auto", border: 0 }}
                        />
                      ) : null}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>

          <td width="25%" valign="top" style={{ padding: "0 3px" }}>
            <a href="https://www.instagram.com/p.in.e.a/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" border="0" bgcolor="#000000">
                <tbody>
                  <tr>
                    <td
                      align="center"
                      valign="middle"
                      style={{
                        color: "#ffffff",
                        fontSize: "19px",
                        lineHeight: "21px",
                        padding: "24px 8px",
                        minHeight: "160px",
                      }}
                    >
                      {firstCardTitle}
                    </td>
                  </tr>
                </tbody>
              </table>
            </a>
          </td>

          <td width="25%" valign="top" style={{ paddingLeft: "6px" }}>
            <a
              href={`https://www.pinea-periodical.com/memberships#${language}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" border="0" bgcolor="#000000">
                <tbody>
                  <tr>
                    <td
                      align="center"
                      valign="middle"
                      style={{
                        color: "#ffffff",
                        fontSize: "19px",
                        lineHeight: "21px",
                        padding: "24px 8px",
                        minHeight: "160px",
                      }}
                    >
                      {secondCardTitle}
                    </td>
                  </tr>
                </tbody>
              </table>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsletterAnnouncements;
