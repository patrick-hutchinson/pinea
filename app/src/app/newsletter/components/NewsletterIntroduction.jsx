import Text from "@/components/Text/Text";

const NewsletterIntroduction = ({ text }) => {
  return (
    <div
      className="newsletter-introduction"
      style={{
        fontSize: "19px",
        lineHeight: "21px",

        width: "100%",
        margin: "0 auto",
      }}
    >
      {/* <Media medium={} /> */}
      <Text className="introduction" style={{ marginTop: "0px" }} text={text} />
    </div>
  );
};

export default NewsletterIntroduction;
