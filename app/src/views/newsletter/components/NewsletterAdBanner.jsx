const NewsletterAdBanner = ({ block }) => {
  const bannerLink = typeof block?.adBanner?.link === "string" ? block.adBanner.link.trim() : "";
  const imageUrl = block?.adBanner?.mediumDesktop?.medium?.url || block?.adBanner?.mediumMobile?.medium?.url || "";

  if (!imageUrl) return null;

  const image = (
    <img
      src={imageUrl}
      width="704"
      alt=""
      border="0"
      style={{ display: "block", width: "100%", maxWidth: "704px", height: "auto", border: 0, msInterpolationMode: "bicubic" }}
    />
  );

  return (
    <table className="newsletter-adBanner" role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
      <tbody>
        <tr>
          <td className="newsletter-module-gap-vertical" align="center" style={{ padding: "75px 8px" }}>
            <table role="presentation" width="704" cellPadding="0" cellSpacing="0" border="0" align="center" style={{ width: "100%", maxWidth: "704px", border: 0 }}>
              <tbody>
                <tr>
                  <td style={{ padding: 0 }}>
                    {bannerLink ? (
                      <a href={bannerLink} target="_blank" rel="noopener noreferrer">
                        {image}
                      </a>
                    ) : (
                      image
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsletterAdBanner;
