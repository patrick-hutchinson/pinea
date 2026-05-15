import Longcopy from "@/components/Longcopy/Longcopy";

const Showcase = ({ block }) => {
  const showcaseLabel = typeof block?.label === "string" ? block.label.trim() : "";
  const hasImageLink = typeof block?.imageLink === "string" && block.imageLink.trim().length > 0;
  const copyrightText = typeof block?.copyright === "string" ? block.copyright.trim() : "";
  const displaySmallImage = Boolean(block?.displaySmallImage);
  const imageStyle = displaySmallImage
    ? {
        display: "block",
        width: "300px",
        height: "auto",
        margin: "0 auto",
      }
    : {
        display: "block",
        width: "100%",
        height: "auto",
        margin: "0 auto",
      };
  const imageElement = hasImageLink ? (
    <a href={block.imageLink} target="_blank" rel="noopener noreferrer">
      <img src={block.image.url} alt="" border="0" style={imageStyle} />
    </a>
  ) : (
    <img src={block.image.url} alt="" border="0" style={imageStyle} />
  );

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
            {displaySmallImage ? (
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
            ) : (
              imageElement
            )}
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

export default Showcase;
