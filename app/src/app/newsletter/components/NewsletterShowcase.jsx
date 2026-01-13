import Longcopy from "@/components/Longcopy/Longcopy";

const NewsletterShowcase = ({ item }) => {
  console.log("showcase image:", item.image);
  return (
    <div
      className="newsletter-running-text"
      style={{
        padding: "50px 30px",
        paddingBottom: "150px",
        lineHeight: "1.4",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <img
        src={item.image.url}
        alt=""
        border="0"
        style={{
          display: "block",
          width: "100%",
          maxWidth: "var(--width-longcopy)",
          height: "auto",
          margin: "0 auto",
        }}
      />
      <Longcopy text={item.text} />
    </div>
  );
};

export default NewsletterShowcase;
