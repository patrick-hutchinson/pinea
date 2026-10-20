const NewsletterPineaIcon = () => {
  const src = "https://www.pinea-periodical.com/icons/pinea_rechteck.png";

  return (
    <>
      <span
        dangerouslySetInnerHTML={{
          __html: `<!--[if mso]><img src="${src}" alt="P.IN.E.A" width="704" border="0" style="display:block;width:704px;height:auto;border:0;padding-bottom:12px;"><![endif]-->`,
        }}
      />
      <span
        dangerouslySetInnerHTML={{
          __html: "<!--[if !mso]><!-->",
        }}
      />
      <img
        src={src}
        alt="P.IN.E.A"
        border="0"
        style={{ display: "block", width: "100%", maxWidth: "1416px", height: "auto", border: 0, paddingBottom: "12px" }}
      />
      <span
        dangerouslySetInnerHTML={{
          __html: "<!--<![endif]-->",
        }}
      />
    </>
  );
};

export default NewsletterPineaIcon;
