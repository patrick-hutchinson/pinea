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
        padding: "12px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <a
        href="https://www.pinea-periodical.com"
        className="newsletter-pinea-logo"
        target="_blank"
        style={{ color: "#fff", textDecoration: "none", fontSize: "13px", lineHeight: "1", margin: "0", padding: "0" }}
      >
        Photography Intermedia Et Al.
      </a>
      <div style={{ display: "flex", gap: "40px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "13px",
            alignItems: "start",
            justifyContent: "center",
            lineHeight: "15px",
          }}
        >
          <a
            href="https://www.pinea-periodical.com/about"
            target="_blank"
            style={{ color: "#fff", textDecoration: "none", lineHeight: "1", margin: "0", padding: "0" }}
          >
            Contact
          </a>
          <a
            href="https://www.pinea-periodical.com/imprint"
            target="_blank"
            style={{ color: "#fff", textDecoration: "none", lineHeight: "1", margin: "0", padding: "0" }}
          >
            Impressum
          </a>
        </div>
        <a href="https://www.bmwkms.gv.at/" target="_blank">
          <img src={logoSrc} style={{ height: "40px" }} />
        </a>
      </div>
    </div>
  );
};

export default NewsletterFooter;
