import Longcopy from "@/components/Longcopy/Longcopy";

const NewsletterFeatureBlock = ({ block }) => {
  const featureLabel = typeof block?.label === "string" ? block.label.trim() : "";
  const hasImageLink = typeof block?.imageLink === "string" && block.imageLink.trim().length > 0;
  const copyrightText = typeof block?.copyright === "string" ? block.copyright.trim() : "";
  const imageElement = hasImageLink ? (
    <a href={block.imageLink} target="_blank" rel="noopener noreferrer">
      <img
        src={block.image.url}
        alt=""
        border="0"
        style={{
          display: "block",
          width: "300px",
          height: "auto",
          margin: "0 auto",
        }}
      />
    </a>
  ) : (
    <img
      src={block.image.url}
      alt=""
      border="0"
      style={{
        display: "block",
        width: "300px",
        height: "auto",
        margin: "0 auto",
      }}
    />
  );

  return (
    <table className="newsletter-feature" role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
      <tbody>
        <tr>
          <td
            className="newsletter-module-gap-bottom"
            style={{ padding: "0 30px", lineHeight: "1.4", maxWidth: "600px", margin: "0 auto", paddingBottom: "75px" }}
          >
            {featureLabel && (
              <p
                style={{
                  margin: "0 0 6px 0",
                  lineHeight: 1,
                  fontWeight: "normal",
                  fontSize: "7.5px",
                  textTransform: "uppercase",
                }}
              >
                {featureLabel}
              </p>
            )}
            <div
              style={{
                width: "100%",
                height: "500px",
                background: "#000000",
                margin: 0,
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {imageElement}
            </div>
            {copyrightText && (
              <p
                style={{
                  margin: "6px 0 12px 0",
                  lineHeight: 1,
                  fontWeight: "normal",
                  fontSize: "7.5px",
                }}
              >
                {copyrightText}
              </p>
            )}
            <Longcopy className="longcopy" style={{ marginTop: "12px", fontSize: "13px", lineHeight: "15px" }} text={block.text} />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsletterFeatureBlock;
