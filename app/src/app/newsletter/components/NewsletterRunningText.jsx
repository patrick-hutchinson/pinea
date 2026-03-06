import Text from "@/components/Text/Text";

const NewsletterRunningText = ({ block }) => {
  return (
    <table className="newsletter-running-text" role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
      <tbody>
        <tr>
          <td
            style={{
              fontSize: "19px",
              lineHeight: "21px",
              width: "100%",
              paddingBottom: "100px",
            }}
          >
            <Text style={{ marginTop: "0px" }} text={block.runningText} />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsletterRunningText;
