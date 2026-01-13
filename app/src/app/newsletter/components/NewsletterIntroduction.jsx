import Text from "@/components/Text/Text";

const NewsletterIntroduction = ({ text }) => {
  return (
    <div
      className="newsletter-introduction"
      style={{
        fontSize: "var(--font-size-3)",
        lineHeight: "var(--line-height-3)",
        // padding: "12px 12px",
        // paddingBottom: "300px",
        lineHeight: "1.4",
        width: "100%",
        // maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {/* <Media medium={} /> */}
      <Text text={text} />
    </div>
  );
};

export default NewsletterIntroduction;
