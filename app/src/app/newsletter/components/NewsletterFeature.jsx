const NewsletterFeature = ({ feature, language }) => {
  console.log(feature, "feature");
  const FeatureTitle = () => {
    return (
      <p
        style={{
          margin: 0,
          color: "#ffffff",
          fontSize: "16px",
          lineHeight: "1.3",
        }}
      >
        {feature.featureTitle}
      </p>
    );
  };

  return (
    <td
      className="na-image"
      style={{
        display: "block",
        maxWidth: "100%",
        height: "550px",
        maxWidth: "500px",
        margin: "0 auto",
        border: 0,
      }}
    >
      <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ border: 0 }}>
        <tr>
          <td
            // className="na-image"
            align="center"
            valign="top"
            style={{
              display: "block",
              maxWidth: "100%",
              height: "500px",
              maxWidth: "500px",
              margin: "0 auto",
              background: "#000",
              border: 0,
            }}
          >
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ border: 0 }}>
              {feature.isSmall && (
                <tr>
                  <td align="left" className="isSmall" style={{ border: 0, paddingTop: "9px", paddingLeft: "12px" }}>
                    <FeatureTitle />
                  </td>
                </tr>
              )}

              {feature.isSmall && (
                <tr>
                  <td height="100" style={{ border: 0 }}>
                    &nbsp;
                  </td>
                </tr>
              )}

              <tr>
                {/* IMAGE AT BOTTOM */}
                <td align="center" valign="bottom" style={{ border: 0 }}>
                  <a
                    href={feature.link}
                    target="_blank"
                    style={{
                      display: "inline-block",
                      textDecoration: "none",
                      width: "100%",
                    }}
                  >
                    <table
                      width={feature.isSmall ? "250" : "500"}
                      height={feature.isSmall ? "250" : "500"}
                      className={feature.isSmall ? "isSmall" : ""}
                      cellPadding="0"
                      cellSpacing="0"
                      role="presentation"
                      style={{
                        backgroundImage: `url(${feature.image.url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        border: 0,
                      }}
                    >
                      <tr>
                        <td align="center" valign="middle" style={{ border: 0 }}>
                          {!feature.isSmall && <FeatureTitle />}
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {/* TEXT BELOW — NOT CONSTRAINED */}
        <tr>
          <td
            align="left"
            style={{
              display: "block",
              marginTop: "6px",
              lineHeight: 1,
              fontWeight: "normal",
              fontSize: "7.5px",
            }}
          >
            copyright
          </td>
        </tr>
      </table>
    </td>
  );
};

export default NewsletterFeature;
