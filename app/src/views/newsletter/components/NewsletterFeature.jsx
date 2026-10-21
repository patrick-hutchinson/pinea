// Keep markup inert until Listmonk evaluates Safe; otherwise its HTML parser sees nested VML/table tags too early.
const listmonkSafe = (html) => `{{ Safe ${JSON.stringify(html).replace(/</g, "\\x3c").replace(/>/g, "\\x3e")} }}`;

const NewsletterFeature = ({ feature, language }) => {
  const featureTitle =
    typeof feature?.featureTitle === "string" ? feature.featureTitle.toLocaleUpperCase(language) : feature?.featureTitle;

  const imageUrl = feature?.image?.url;
  const href = typeof feature?.href === "string" && feature.href.trim().length > 0 ? feature.href.trim() : "";
  const tileHeight = 500;
  const copyright = feature?.copyright;
  const textColor = feature?.textColor === "black" ? "#000000" : "#ffffff";
  const outlookTileWidth = 352;
  // VML measures its fill target in points. Defining it makes `aspect="atleast"`
  // behave like object-fit: cover in Outlook instead of letterboxing the image.
  const outlookFillSize = `${outlookTileWidth * 0.75}pt,${tileHeight * 0.75}pt`;
  // Let Sanity crop the Outlook asset to the exact tile ratio. Word's VML
  // renderer is unreliable at cropping arbitrary landscape images itself.
  const outlookImageUrl = imageUrl
    ? `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}w=${outlookTileWidth * 2}&h=${tileHeight * 2}&fit=crop&crop=center&fm=jpg`
    : "";
  const titleCellHeight = copyright ? tileHeight - 24 : tileHeight;

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
            <span
              dangerouslySetInnerHTML={{
                __html: imageUrl
                  ? listmonkSafe(`<!--[if mso]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:${outlookTileWidth}px;height:${tileHeight}px;v-text-anchor:middle;"><v:fill type="frame" aspect="atleast" size="${outlookFillSize}" src="${outlookImageUrl}" color="#000000" /><v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:false;"><![endif]-->`)
                  : listmonkSafe(`<!--[if mso]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:${outlookTileWidth}px;height:${tileHeight}px;"><v:fill color="#000000" /><v:textbox inset="0,0,0,0"><![endif]-->`),
              }}
            />
            <table
              role="presentation"
              width="100%"
              height={tileHeight}
              cellPadding="0"
              cellSpacing="0"
              border="0"
              style={{ border: 0, height: `${tileHeight}px` }}
            >
              <tbody>
                <tr>
                  <td
                    className="newsletter-running-copy"
                    align="center"
                    valign="middle"
                    height={titleCellHeight}
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      color: textColor,
                      fontSize: "16px",
                      lineHeight: "18px",
                      height: `${titleCellHeight}px`,
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
            <span
              dangerouslySetInnerHTML={{
                __html: listmonkSafe("<!--[if mso]></v:textbox></v:rect><![endif]-->"),
              }}
            />
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
