const NewsletterAdBanner = ({ block }) => {
  console.log(block, "ad banner block");
  return (
    <div>
      <div
        className="newsletter-adBanner"
        style={{
          margin: "150px auto",

          maxWidth: "600px",
        }}
      >
        <img
          src={block.adBanner.mediumDesktop.medium.url}
          alt=""
          border="0"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
};

export default NewsletterAdBanner;
