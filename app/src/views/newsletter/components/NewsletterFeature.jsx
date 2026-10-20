const NewsletterFeature = ({ feature, language }) => {
  const featureTitle =
    typeof feature?.featureTitle === "string" ? feature.featureTitle.toLocaleUpperCase(language) : feature?.featureTitle;

  const imageUrl = feature?.image?.url;
  const href = typeof feature?.href === "string" && feature.href.trim().length > 0 ? feature.href.trim() : "";
  const tileHeight = 500;
  const copyright = feature?.copyright;
  const textColor = feature?.textColor === "black" ? "#000000" : "#ffffff";

  const TileInner = () => (
    <table
      role="presentation"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border="0"
      style={{
        border: 0,
        backgroundColor: "#000000",
        height: `${tileHeight}px`,
      }}
    >
      <tbody>
        <tr>
          <td
            align="left"
            valign="top"
            background={imageUrl || undefined}
            style={{
              border: 0,
              padding: 0,
              height: `${tileHeight}px`,
              backgroundColor: "#000000",
              backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              backgroundSize: "cover",
            }}
          >
            <table role="presentation" width="100%" height={tileHeight} cellPadding="0" cellSpacing="0" border="0" style={{ border: 0 }}>
              <tbody>
                <tr>
                  <td
                    className="newsletter-running-copy"
                    align="center"
                    valign="middle"
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      color: textColor,
                      fontSize: "16px",
                      lineHeight: "18px",
                      height: "100%",
                    }}
                  >
                    {featureTitle}
                  </td>
                </tr>
                {copyright ? (
                  <tr>
                    <td
                      align="left"
                      valign="bottom"
                      style={{
                        padding: "0 8px 8px 8px",
                        textAlign: "left",
                        color: textColor,
                        fontSize: "7.5px",
                        lineHeight: "1.2",
                      }}
                    >
                      {copyright}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <table
      role="presentation"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border="0"
      style={{
        border: 0,
        paddingRight: 0,
        paddingLeft: 0,
        paddingBottom: 0,
      }}
    >
      <tbody>
        <tr>
          <td style={{ border: 0, padding: 0 }}>
            {href ? (
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                style={{ textDecoration: "none", color: textColor }}
              >
                <TileInner />
              </a>
            ) : (
              <TileInner />
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsletterFeature;
