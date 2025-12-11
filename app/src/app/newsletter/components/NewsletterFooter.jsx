const NewsletterFooter = ({ language, site }) => {
  // const src = language === "en" ? site.BMWKMW_logo_en
  console.log(site.BMWKMS_logo_de.src, "logo source DE");
  console.log(site.BMWKMS_logo_en.src, "logo source EN");
  console.log(language, "langauge");
  return (
    <div
      style={{
        background: "#000",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        padding: "12px",
      }}
    >
      <a href="https://www.bmwkms.gv.at/" target="_blank">
        <img src="/logos/BMWKMS_logo_weiss_de.png" style={{ height: "40px" }} />
      </a>
    </div>
  );
};

export default NewsletterFooter;
