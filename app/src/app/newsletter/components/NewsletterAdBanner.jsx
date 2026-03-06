const NewsletterAdBanner = ({ block }) => {
  return (
    <table className="newsletter-adBanner" role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
      <tbody>
        <tr>
          <td style={{ padding: "150px 0", maxWidth: "600px", margin: "0 auto" }}>
            <img
              src={block.adBanner.mediumDesktop.medium.url}
              alt=""
              border="0"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                margin: "0 auto",
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsletterAdBanner;
