import Longcopy from "@/components/Longcopy/Longcopy";

const NewsletterShowcase = ({ item }) => {
  return (
    <div>
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
        <h4
          style={{
            display: "block",
            width: "100%",
            // maxWidth: "var(--max-width-longcopy)",
            // minWidth: "var(--min-width-longcopy)",
            width: "80vw !important",
            maxWidth: "750px",
            minWidth: "450px",
            height: "auto",
            margin: "0 auto",
            marginBottom: "12px",
            fontWeight: "normal",
          }}
        >
          Promotion
        </h4>
        <img
          src={item.image.url}
          alt=""
          border="0"
          style={{
            display: "block",
            width: "100%",
            // maxWidth: "var(--max-width-longcopy)",
            // minWidth: "var(--min-width-longcopy)",
            width: "80vw !important",
            maxWidth: "750px",
            minWidth: "450px",
            height: "auto",
            margin: "0 auto",
            marginBottom: "12px",
          }}
        />
        <Longcopy text={item.text} />
      </div>
    </div>
  );
};

export default NewsletterShowcase;
