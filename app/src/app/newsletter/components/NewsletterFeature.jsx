const NewsletterFeature = ({ feature, language, isLast }) => {
  const featureTitle =
    typeof feature?.featureTitle === "string" ? feature.featureTitle.toLocaleUpperCase(language) : feature?.featureTitle;

  const imageUrl = feature?.image?.url;
  const href = feature?.link;
  const tileHeight = 500;
  const copyright = feature?.copyright;

  const TileInner = () => (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: `${tileHeight}px`,
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          border="0"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            border: 0,
          }}
        />
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#ffffff",
            fontSize: "16px",
            lineHeight: "1.3",
          }}
        >
          {featureTitle}
        </p>
      </div>

      {copyright ? (
        <div
          style={{
            position: "absolute",
            left: "8px",
            bottom: "8px",
            fontSize: "7.5px",
            lineHeight: "1.2",
            color: "#ffffff",
            textAlign: "left",
            maxWidth: "85%",
          }}
        >
          {copyright}
        </div>
      ) : null}
    </div>
  );

  return (
    <td
      className="newsletter-feature-col"
      width="50%"
      valign="top"
      style={{ border: 0, padding: isLast ? "0 0 0 1px" : "0 1px 0 0" }}
    >
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0" style={{ border: 0 }}>
        <tbody>
          <tr>
            <td style={{ border: 0, padding: 0 }}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#ffffff" }}>
                  <TileInner />
                </a>
              ) : (
                <TileInner />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  );
};

export default NewsletterFeature;
