const NewsletterFeature = ({ feature, language }) => {
  const featureTitle =
    typeof feature?.featureTitle === "string" ? feature.featureTitle.toLocaleUpperCase(language) : feature?.featureTitle;

  const imageUrl = feature?.image?.url;
  const href = typeof feature?.href === "string" && feature.href.trim().length > 0 ? feature.href.trim() : "";
  const copyright = feature?.copyright;
  const textColor = feature?.textColor === "black" ? "#000000" : "#ffffff";
  const captionBackgroundColor = textColor === "#000000" ? "#ffffff" : "#000000";
  const croppedImageUrl = imageUrl
    ? `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}w=704&h=1000&fit=crop&fm=jpg`
    : "";

  const TileInner = () => (
    <table
      role="presentation"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border="0"
      style={{
        border: 0,
      }}
    >
      <tbody>
        {croppedImageUrl ? (
          <tr>
            <td style={{ border: 0, padding: 0 }}>
              <img
                src={croppedImageUrl}
                alt={featureTitle || ""}
                width="100%"
                border="0"
                style={{ display: "block", width: "100%", height: "auto", border: 0 }}
              />
            </td>
          </tr>
        ) : null}
        {featureTitle || copyright ? (
          <tr>
            <td
              className="newsletter-running-copy"
              align="center"
              bgcolor={captionBackgroundColor}
              style={{
                padding: featureTitle ? "12px" : "0 8px 8px 8px",
                textAlign: featureTitle ? "center" : "left",
                color: textColor,
                backgroundColor: captionBackgroundColor,
                fontSize: "16px",
                lineHeight: "18px",
              }}
            >
              {featureTitle ? <div>{featureTitle}</div> : null}
              {copyright ? (
                <div style={{ marginTop: featureTitle ? "8px" : 0, fontSize: "7.5px", lineHeight: "10px", textAlign: "left" }}>
                  {copyright}
                </div>
              ) : null}
            </td>
          </tr>
        ) : null}
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
