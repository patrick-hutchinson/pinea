import Longcopy from "@/components/Longcopy/Longcopy";

const NewsletterShowcase = ({ block, language }) => {
  const showcaseLabel = typeof block?.label === "string" ? block.label.trim() : "";
  const hasImageLink = typeof block?.imageLink === "string" && block.imageLink.trim().length > 0;

  return (
    <table className="newsletter-showcase" role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
      <tbody>
        <tr>
          <td
            className="newsletter-module-gap-bottom"
            style={{ padding: "0 30px", lineHeight: "1.4", maxWidth: "600px", margin: "0 auto", paddingBottom: "75px" }}
          >
            {showcaseLabel && (
              <p
                style={{
                  margin: "0 0 6px 0",
                  lineHeight: 1,
                  fontWeight: "normal",
                  fontSize: "7.5px",
                  textTransform: "uppercase",
                }}
              >
                {showcaseLabel}
              </p>
            )}
            {hasImageLink ? (
              <a href={block.imageLink} target="_blank" rel="noopener noreferrer">
                <img
                  src={block.image.url}
                  alt=""
                  border="0"
                  style={{
                    display: "block",
                    width: "100%",
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
                  width: "100%",
                  height: "auto",
                  margin: "0 auto",
                }}
              />
            )}
            <p
              style={{
                margin: "6px 0 12px 0",
                lineHeight: 1,
                fontWeight: "normal",
                fontSize: "7.5px",
              }}
            >
              {`${language === "en" ? "Photo:" : "Foto:"} Julian Lee Harather`}
            </p>
            <Longcopy className="longcopy" style={{ marginTop: "12px", fontSize: "13px", lineHeight: "15px" }} text={block.text} />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsletterShowcase;
