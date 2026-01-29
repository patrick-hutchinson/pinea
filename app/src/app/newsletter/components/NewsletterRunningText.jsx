import Text from "@/components/Text/Text";

const NewsletterRunningText = ({ block }) => {
  return (
    <div
      className="newsletter-running-text"
      style={{
        fontSize: "19px",
        lineHeight: "21px",

        width: "100%",
        margin: "0 auto",
        marginBottom: "100px",
      }}
    >
      <Text style={{ marginTop: "0px" }} text={block.runningText} />
    </div>
  );
};

export default NewsletterRunningText;
