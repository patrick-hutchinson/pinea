const NewsletterAdBanner = ({ block }) => {
  const bannerLink = typeof block?.adBanner?.link === "string" ? block.adBanner.link.trim() : "";
  const desktopImageUrl = block?.adBanner?.mediumDesktop?.medium?.url || "";
  const mobileImageUrl = block?.adBanner?.mediumMobile?.medium?.url || desktopImageUrl;

  const renderBannerImage = (imageUrl) => {
    if (!imageUrl) return null;

    const image = (
      <img
        src={imageUrl}
        alt=""
        border="0"
        style={{
          display: "block",
          width: "100%",
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

  return (
    <>
      <style>{`
        @media only screen and (min-width: 601px) {
          .newsletter-adBanner .banner-mobile-row {
            display: none !important;
            max-height: 0 !important;
            overflow: hidden !important;
            mso-hide: all !important;
          }

          .newsletter-adBanner .banner-desktop-row {
            display: table-row !important;
            max-height: none !important;
            overflow: visible !important;
            mso-hide: none !important;
          }
        }
      `}</style>
      <table className="newsletter-adBanner" role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
        <tbody>
          <tr
            className="banner-mobile-row"
            style={{
              display: "table-row",
              maxHeight: "none",
              overflow: "visible",
            }}
          >
            <td className="newsletter-module-gap-vertical" style={{ padding: "75px 0", maxWidth: "600px", margin: "0 auto" }}>
              {renderBannerImage(mobileImageUrl)}
            </td>
          </tr>
          <tr
            className="banner-desktop-row"
            style={{
              display: "none",
              maxHeight: 0,
              overflow: "hidden",
              msoHide: "all",
            }}
          >
            <td className="newsletter-module-gap-vertical" style={{ padding: "75px 0", maxWidth: "600px", margin: "0 auto" }}>
              {renderBannerImage(desktopImageUrl)}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default NewsletterAdBanner;
