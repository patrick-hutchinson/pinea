// Keep Outlook-only markup inert until Listmonk evaluates Safe. Otherwise its
// HTML template parser strips conditional comments before delivery.
const listmonkSafe = (html) => `{{ Safe ${JSON.stringify(html).replace(/</g, "\\x3c").replace(/>/g, "\\x3e")} }}`;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const NewsletterAdBanner = ({ block }) => {
  const bannerLink = typeof block?.adBanner?.link === "string" ? block.adBanner.link.trim() : "";
  const desktopImageUrl = block?.adBanner?.mediumDesktop?.medium?.url || "";
  const mobileImageUrl = block?.adBanner?.mediumMobile?.medium?.url || desktopImageUrl;

  const renderBannerImage = (imageUrl, width) => {
    if (!imageUrl) return null;

    const image = (
      <img
        src={imageUrl}
        width={width}
        alt=""
        border="0"
        style={{
          display: "block",
          width: "100%",
          maxWidth: `${width}px`,
          height: "auto",
          margin: "0 auto",
        }}
      />
    );

    if (!bannerLink) return image;

    return (
      <a href={bannerLink} target="_blank" rel="noopener noreferrer">
        {image}
      </a>
    );
  };

  const renderOutlookBanner = () => {
    if (!desktopImageUrl) return null;

    const image = `<img src="${escapeHtml(desktopImageUrl)}" width="720" alt="" border="0" style="display:block;width:720px;height:auto;border:0;" />`;
    const content = bannerLink
      ? `<a href="${escapeHtml(bannerLink)}" target="_blank" style="text-decoration:none;">${image}</a>`
      : image;

    return (
      <span
        dangerouslySetInnerHTML={{
          __html: listmonkSafe(
            `<!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:0;"><table role="presentation" width="720" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:0;">${content}</td></tr></table></td></tr></table><![endif]-->`,
          ),
        }}
      />
    );
  };

  return (
    <>
      {renderOutlookBanner()}
      <span
        dangerouslySetInnerHTML={{
          __html: listmonkSafe("<!--[if !mso]><!-->"),
        }}
      />
      <style>{`
        @media only screen and (max-width: 600px) {
          .newsletter-adBanner .banner-mobile-row {
            display: table-row !important;
            max-height: none !important;
            overflow: visible !important;
          }

          .newsletter-adBanner .banner-desktop-row {
            display: none !important;
            max-height: 0 !important;
            overflow: hidden !important;
            mso-hide: all !important;
          }

        }
      `}</style>
      <table className="newsletter-adBanner" role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
        <tbody>
          <tr
            className="banner-mobile-row"
            style={{
              display: "none",
              maxHeight: 0,
              overflow: "hidden",
              msoHide: "all",
            }}
          >
            <td
              className="newsletter-module-gap-vertical newsletter-adBanner-content"
              style={{ padding: "75px 0", margin: "0 auto" }}
            >
              <table
                className="newsletter-adBanner-inner"
                role="presentation"
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                border="0"
                align="center"
                style={{ width: "100%", maxWidth: "720px", margin: "0 auto", border: 0 }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: 0 }}>{renderBannerImage(mobileImageUrl, 720)}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr
            className="banner-desktop-row"
            style={{
              display: "table-row",
              maxHeight: "none",
              overflow: "visible",
            }}
          >
            <td
              className="newsletter-module-gap-vertical newsletter-adBanner-content"
              style={{ padding: "75px 0", margin: "0 auto" }}
            >
              <table
                className="newsletter-adBanner-inner"
                role="presentation"
                width="720"
                cellPadding="0"
                cellSpacing="0"
                border="0"
                align="center"
                style={{ width: "100%", maxWidth: "720px", margin: "0 auto", border: 0 }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: 0 }}>{renderBannerImage(desktopImageUrl, 720)}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <span
        dangerouslySetInnerHTML={{
          __html: listmonkSafe("<!--<![endif]-->"),
        }}
      />
    </>
  );
};

export default NewsletterAdBanner;
