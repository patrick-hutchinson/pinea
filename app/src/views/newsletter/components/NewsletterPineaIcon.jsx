// Keep Outlook-only markup inert until Listmonk evaluates Safe. Otherwise its
// HTML template parser strips conditional comments before delivery.
const listmonkSafe = (html) => `{{ Safe ${JSON.stringify(html).replace(/</g, "\\x3c").replace(/>/g, "\\x3e")} }}`;

const NewsletterPineaIcon = () => {
  const imageUrl = "https://www.pinea-periodical.com/icons/pinea_rechteck.png";

  return (
    <>
      <span
        dangerouslySetInnerHTML={{
          // The Outlook shell is 720px wide, with 8px gutters on each side.
          // 528pt x 119.85pt keeps the asset's native 11415:2590 ratio intact.
          __html: listmonkSafe(
            `<!--[if mso]><table role="presentation" width="704" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:0;"><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:528pt;height:119.85pt;"><v:fill type="frame" src="${imageUrl}" color="#ffffff" /></v:rect></td></tr><tr><td height="10" style="height:10px;font-size:0;line-height:0;">&nbsp;</td></tr></table><![endif]-->`,
          ),
        }}
      />
      <span
        dangerouslySetInnerHTML={{
          __html: listmonkSafe("<!--[if !mso]><!-->"),
        }}
      />
      <img
        src={imageUrl}
        alt="P.IN.E.A"
        width="704"
        border="0"
        style={{ display: "block", width: "100%", maxWidth: "1416px", height: "auto", border: 0, paddingBottom: "10px" }}
      />
      <span
        dangerouslySetInnerHTML={{
          __html: listmonkSafe("<!--<![endif]-->"),
        }}
      />
    </>
  );
};

export default NewsletterPineaIcon;
