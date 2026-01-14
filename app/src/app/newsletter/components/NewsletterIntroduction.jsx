import Text from "@/components/Text/Text";

const NewsletterIntroduction = ({ text }) => {
  return (
    <div
      className="newsletter-introduction"
      style={{
        fontSize: "19px",
        lineHeight: "21px",
        // padding: "12px 12px",
        // paddingBottom: "300px",
        // lineHeight: "1.4",
        width: "100%",
        // maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {/* <Media medium={} /> */}
      <Text style={{ marginTop: "0px" }} text={text} />
    </div>
  );
};

export default NewsletterIntroduction;
