import NewsletterFeature from "./NewsletterFeature";

const NewsletterDoubleFeature = ({ block, language }) => {
  const story = Array.isArray(block?.story) ? block.story : [];

  return (
    <table
      className="doubleFeature"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      border="0"
      style={{ marginBottom: "150px", marginTop: "150px", border: 0 }}
    >
      <tbody>
        <tr>
          <td align="center" style={{ border: 0, padding: 0, fontSize: 0, lineHeight: 0 }}>
            {story.map((feature, index) => (
              <table
                key={feature?._key || feature?.link || feature?.featureTitle || index}
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                border="0"
                width="100%"
                style={{
                  display: "inline-block",
                  verticalAlign: "top",
                  width: "100%",
                  maxWidth: "50%",
                  minWidth: "280px",
                  border: 0,
                  boxSizing: "border-box",
                  paddingRight: index === 0 ? "1px" : "0",
                  paddingLeft: index > 0 ? "1px" : "0",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ border: 0, padding: 0, fontSize: "16px", lineHeight: "normal" }}>
                      <NewsletterFeature feature={feature} language={language} />
                    </td>
                  </tr>
                </tbody>
              </table>
            ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsletterDoubleFeature;
