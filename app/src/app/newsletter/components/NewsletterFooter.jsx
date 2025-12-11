const NewsletterFooter = ({ language, site }) => {
  // const src = language === "en" ? site.BMWKMW_logo_en
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
