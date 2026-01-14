import Longcopy from "@/components/Longcopy/Longcopy";

const NewsletterShowcase = ({ item, language }) => {
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
        <h5
          style={{
            display: "block",
            width: "100%",

            height: "auto",
            margin: "0 auto",
            marginBottom: "6px",
            fontWeight: "normal",
            fontSize: "7.5px",
            textTransform: "uppercase",
          }}
        >
          Promotion
        </h5>
        <img
          src={item.image.url}
          alt=""
          border="0"
          style={{
            display: "block",
            width: "100%",

            height: "auto",
            margin: "0 auto",
            // marginBottom: "12px",
          }}
        />
        <h5
          style={{
            display: "block",
            width: "100%",

            height: "auto",
            margin: "0 auto",
            marginTop: "6px",
            marginBottom: "12px",
            fontWeight: "normal",
            fontSize: "7.5px",
            textTransform: "uppercase",
          }}
        >
          {`${language === "en" ? "Photo:" : "Foto:"} Julian Lee Harather`}
        </h5>
        <Longcopy
          className="longcopy"
          style={{ marginTop: "12px", fontSize: "13px", lineHeight: "15px" }}
          text={item.text}
        />
      </div>
    </div>
  );
};

export default NewsletterShowcase;
