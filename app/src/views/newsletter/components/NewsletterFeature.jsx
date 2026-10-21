// Keep markup inert until Listmonk evaluates Safe; otherwise its HTML parser sees nested VML/table tags too early.
const listmonkSafe = (html) => `{{ Safe ${JSON.stringify(html).replace(/</g, "\\x3c").replace(/>/g, "\\x3e")} }}`;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const NewsletterFeature = ({ feature, language, outlookTileWidth = 352 }) => {
  const featureTitle =
    typeof feature?.featureTitle === "string" ? feature.featureTitle.toLocaleUpperCase(language) : feature?.featureTitle;

  const imageUrl = feature?.image?.url;
  const href = typeof feature?.href === "string" && feature.href.trim().length > 0 ? feature.href.trim() : "";
  const tileHeight = 500;
  const copyright = feature?.copyright;
  const textColor = feature?.textColor === "black" ? "#000000" : "#ffffff";
  // VML measures its fill target in points. Defining it makes `aspect="atleast"`
  // behave like object-fit: cover in Outlook instead of letterboxing the image.
  const outlookFillSize = `${outlookTileWidth * 0.75}pt,${tileHeight * 0.75}pt`;
  // Let Sanity crop the Outlook asset to the exact tile ratio. Word's VML
  // renderer is unreliable at cropping arbitrary landscape images itself.
  const outlookImageUrl = imageUrl
    ? `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}w=${outlookTileWidth * 2}&h=${tileHeight * 2}&fit=crop&crop=center&fm=jpg`
    : "";
  // The title cell has 12px vertical padding. Account for it so a regular
  // feature remains exactly as tall as the 500px small-feature canvas.
  const titleCellHeight = tileHeight - 24;
  const isSmall = feature?.isSmall === true;
  const smallImageWidth = Math.round(outlookTileWidth * 0.7);
  const imageWidth = Number(feature?.image?.dimensions?.width);
  const imageHeight = Number(feature?.image?.dimensions?.height);
  const smallImageHeight = imageWidth > 0 && imageHeight > 0 ? Math.round((smallImageWidth * imageHeight) / imageWidth) : null;

  const renderOutlookSmallFeature = () => {
    const image = `<img src="${escapeHtml(imageUrl)}" width="${smallImageWidth}"${smallImageHeight ? ` height="${smallImageHeight}"` : ""} alt="" border="0" style="display:block;border:0;width:${smallImageWidth}px;${smallImageHeight ? `height:${smallImageHeight}px;` : "height:auto;"}" />`;
    const linkedImage = href
      ? `<a href="${escapeHtml(href)}" target="${href.startsWith("mailto:") ? "_self" : "_blank"}" style="text-decoration:none;">${image}</a>`
      : image;

    return listmonkSafe(
      `<!--[if mso]><table role="presentation" width="${outlookTileWidth}" height="${tileHeight}" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="width:${outlookTileWidth}px;height:${tileHeight}px;background-color:#000000;border:0;"><tr><td height="${tileHeight}" align="center" valign="middle" style="height:${tileHeight}px;padding:0;text-align:center;vertical-align:middle;">${linkedImage}</td></tr></table><![endif]-->`,
    );
  };

  const SmallTileInner = () => (
    <table
      role="presentation"
      width="100%"
      height={tileHeight}
      cellPadding="0"
      cellSpacing="0"
      border="0"
      bgcolor="#000000"
      style={{ border: 0, backgroundColor: "#000000", height: `${tileHeight}px`, minHeight: `${tileHeight}px` }}
    >
      <tbody>
        <tr height={tileHeight} style={{ height: `${tileHeight}px` }}>
          <td
            height={tileHeight}
            align="center"
            valign="middle"
            style={{ height: `${tileHeight}px`, padding: 0, textAlign: "center", verticalAlign: "middle" }}
          >
            <img
              src={imageUrl}
              alt={featureTitle || ""}
              width={smallImageWidth}
              border="0"
              style={{ display: "block", width: "70%", height: "auto", margin: "0 auto", border: 0 }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );

  const TileInner = () => (
    <table
      role="presentation"
      width="100%"
      height={tileHeight}
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
      height={tileHeight}
      cellPadding="0"
      cellSpacing="0"
      border="0"
      style={{
        border: 0,
        height: `${tileHeight}px`,
        paddingRight: 0,
        paddingLeft: 0,
        paddingBottom: 0,
      }}
    >
      <tbody>
        <tr height={tileHeight} style={{ height: `${tileHeight}px` }}>
          <td height={tileHeight} style={{ border: 0, height: `${tileHeight}px`, padding: 0 }}>
            {isSmall && imageUrl ? (
              <>
                <span dangerouslySetInnerHTML={{ __html: renderOutlookSmallFeature() }} />
                <span dangerouslySetInnerHTML={{ __html: listmonkSafe("<!--[if !mso]><!-->") }} />
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    style={{ textDecoration: "none", color: textColor }}
                  >
                    <SmallTileInner />
                  </a>
                ) : (
                  <SmallTileInner />
                )}
                <span dangerouslySetInnerHTML={{ __html: listmonkSafe("<!--<![endif]-->") }} />
              </>
            ) : href ? (
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
