import NewsletterPortableText from "./NewsletterPortableText";

const NewsletterRunningText = ({ block }) => {
  return (
    <table className="newsletter-running-text" role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
      <tbody>
        <tr>
          <td
            className="newsletter-running-copy newsletter-running-gap"
            style={{
              fontSize: "16px",
              lineHeight: "18px",
              width: "100%",
              paddingBottom: "75px",
            }}
          >
            <NewsletterPortableText
              value={block.runningText}
              style={{
                marginTop: 0,
                fontSize: "16px",
                lineHeight: "18px",
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsletterRunningText;
