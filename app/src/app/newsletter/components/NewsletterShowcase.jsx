import Longcopy from "@/components/Longcopy/Longcopy";

const NewsletterShowcase = ({ block, language }) => {
  return (
    <table className="newsletter-showcase" role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
      <tbody>
        <tr>
          <td style={{ padding: "0 30px", lineHeight: "1.4", maxWidth: "600px", margin: "0 auto", paddingBottom: "150px" }}>
            <p
              style={{
                margin: "0 0 6px 0",
                lineHeight: 1,
                fontWeight: "normal",
                fontSize: "7.5px",
                textTransform: "uppercase",
              }}
            >
              Promotion
            </p>
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
