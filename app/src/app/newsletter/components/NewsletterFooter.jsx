const NewsletterFooter = ({ language, site }) => {
  console.log(site.BMWKMS_logo_de.asset.url, "logo source DE");
  console.log(site.BMWKMS_logo_en.asset.url, "logo source EN");
  console.log(site, "site");
  console.log(language, "langauge");

  const logoSrc = language === "de" ? site.BMWKMS_logo_de.asset.url : site.BMWKMS_logo_en.asset.url;
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
        <img src={logoSrc} style={{ height: "40px" }} />
      </a>
    </div>
  );
};

export default NewsletterFooter;
