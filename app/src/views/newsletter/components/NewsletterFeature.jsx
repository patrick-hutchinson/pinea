const NewsletterFeature = ({ feature, language }) => {
  // 720px is the fixed Outlook canvas, leaving 704px inside its 8px page gutters.
  // Each two-column feature is therefore 352px wide at a 704:1000 crop ratio.
  const imageWidth = 352;
  const imageHeight = 500;
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
        {featureTitle ? (
          <tr>
            <td
              className="newsletter-running-copy"
              align="center"
              style={{
                padding: "0 8px 12px 8px",
                textAlign: "center",
                color: "#000000",
                backgroundColor: "transparent",
                fontSize: "16px",
                lineHeight: "18px",
              }}
            >
              {featureTitle}
            </td>
          </tr>
        ) : null}
        {croppedImageUrl ? (
          <tr>
            <td style={{ border: 0, padding: 0 }}>
              <img
                src={croppedImageUrl}
                alt={featureTitle || ""}
                width={imageWidth}
                height={imageHeight}
                border="0"
                style={{ display: "block", width: "100%", height: "auto", border: 0, msInterpolationMode: "bicubic" }}
              />
            </td>
          </tr>
        ) : null}
        {copyright ? (
          <tr>
            <td
              className="newsletter-running-copy"
              align="left"
              bgcolor={captionBackgroundColor}
              style={{
                padding: "0 8px 8px 8px",
                textAlign: "left",
                color: textColor,
                backgroundColor: captionBackgroundColor,
                fontSize: "16px",
                lineHeight: "18px",
              }}
            >
              <div style={{ fontSize: "7.5px", lineHeight: "10px" }}>{copyright}</div>
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
