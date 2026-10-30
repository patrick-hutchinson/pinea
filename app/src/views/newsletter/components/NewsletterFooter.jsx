import { Fragment } from "react";

// Keep Outlook-only markup inert until Listmonk evaluates Safe. Otherwise its
// HTML template parser strips conditional comments before delivery.
const listmonkSafe = (html) => `{{ Safe ${JSON.stringify(html).replace(/</g, "\\x3c").replace(/>/g, "\\x3e")} }}`;

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const getDefaultLogos = (language) => [
  {
    id: "kulturland-noe",
    url: "https://preview.pinea-periodical.com/logos/kulturland_schwarz-weiss.jpg",
    alt: "Kulturland Niederösterreich",
    link: "https://www.noe.gv.at/noe/Kunst-Kultur/Kunst___Kultur.html",
    desktopWidth: 120,
    mobileWidth: 60,
    outlookWidth: 120,
  },
  {
    id: "bmwkms",
    url:
      language === "de"
        ? "https://www.pinea-periodical.com/logos/BMWKMS_de.png"
        : "https://www.pinea-periodical.com/logos/BMWKMS_en.png",
    alt: "BMWKMS",
    link: "https://www.bmwkms.gv.at/",
    desktopWidth: 80,
    mobileWidth: 40,
    outlookWidth: 80,
  },
  {
    id: "stadt-wien",
    url: "https://www.pinea-periodical.com/logos/Stadt_Wien_Kultur_neg_rgb.png",
    alt: "Stadt Wien",
    link: "https://www.wien.gv.at",
    desktopWidth: 60,
    mobileWidth: 60,
    outlookWidth: 120,
  },
];

const normaliseLogos = (logos, language) => {
  const configuredLogos = Array.isArray(logos)
    ? logos
        .filter((logo) => typeof logo?.url === "string" && logo.url.trim().length > 0)
        .map((logo, index) => ({
          id: logo._key || logo.name || index,
          url: logo.url.trim(),
          alt: logo.alt || logo.name || "Footer logo",
          link: logo.link || "",
          desktopWidth: Number.isFinite(logo.desktopWidth) ? logo.desktopWidth : 80,
          mobileWidth: Number.isFinite(logo.mobileWidth) ? logo.mobileWidth : 60,
          outlookWidth: Number.isFinite(logo.outlookWidth) ? logo.outlookWidth : logo.desktopWidth || 80,
        }))
    : [];

  return configuredLogos.length > 0 ? configuredLogos : getDefaultLogos(language);
};

const NewsletterFooter = ({ language, logos }) => {
  const gap = 10;
  const linksWidth = 78;
  const footerLogos = normaliseLogos(logos, language);
  const logoBlockWidth = footerLogos.reduce((width, logo) => width + logo.desktopWidth, 0) + gap * footerLogos.length;
  const rightBlockWidth = linksWidth + logoBlockWidth;
  const homepageUrl = `https://www.pinea-periodical.com/${language}`;

  const renderLogo = (logo, width) => {
    const image = <img src={logo.url} alt={logo.alt} width={width} style={{ display: "block", border: 0, width: `${width}px`, height: "auto" }} />;

    return logo.link ? (
      <a href={logo.link} target="_blank" rel="noreferrer">
        {image}
      </a>
    ) : (
      image
    );
  };

  const outlookLogoCells = footerLogos
    .map((logo, index) => {
      const image = `<img src="${escapeHtml(logo.url)}" alt="${escapeHtml(logo.alt)}" width="${logo.outlookWidth}" border="0" style="display:block;border:0;width:${logo.outlookWidth}px;height:auto;" />`;
      const content = logo.link ? `<a href="${escapeHtml(logo.link)}" target="_blank">${image}</a>` : image;
      const spacer = index < footerLogos.length - 1 ? `<td width="${gap}" style="width:${gap}px;font-size:1px;line-height:1px;padding:0;">&nbsp;</td>` : "";

      return `<td valign="bottom" style="padding:0;">${content}</td>${spacer}`;
    })
    .join("");

  const renderOutlookFooter = () => (
    <span
      dangerouslySetInnerHTML={{
        __html: listmonkSafe(
          `<!--[if mso]><table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#000000" style="background-color:#000000;border:0;"><tr><td style="padding:8px;"><table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td width="50%" align="left" valign="bottom" style="font-size:13px;line-height:13px;color:#ffffff;padding:0;"><a href="${homepageUrl}" target="_blank" style="color:#ffffff;text-decoration:none;white-space:nowrap;">P.IN.E.A Periodical</a></td><td width="50%" align="right" valign="bottom" style="padding:0;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" align="right"><tr>${outlookLogoCells}</tr></table></td></tr></table></td></tr></table><![endif]-->`,
        ),
      }}
    />
  );

  return (
    <>
      {renderOutlookFooter()}
      <span dangerouslySetInnerHTML={{ __html: listmonkSafe("<!--[if !mso]><!-->") }} />
      <style>{`
        @media only screen and (min-width: 601px) {
          .newsletter-footer .footer-gutter { padding: 12px !important; }
          .newsletter-footer .footer-mobile-row { display: none !important; max-height: 0 !important; overflow: hidden !important; mso-hide: all !important; }
          .newsletter-footer .footer-desktop-row { display: table-row !important; max-height: none !important; overflow: visible !important; mso-hide: none !important; }
        }
      `}</style>
      <table className="newsletter-footer" role="presentation" width="100%" border="0" cellPadding="0" cellSpacing="0" bgcolor="#000000" style={{ backgroundColor: "#000000", border: 0 }}>
        <tbody>
          <tr>
            <td className="footer-gutter" style={{ padding: "8px" }}>
              <table role="presentation" width="100%" border="0" cellPadding="0" cellSpacing="0" style={{ border: 0 }}>
                <tbody>
                  <tr className="footer-mobile-row" style={{ display: "table-row", maxHeight: "none", overflow: "visible" }}>
                    <td align="left" valign="bottom" style={{ fontSize: "13px", lineHeight: "13px", color: "#fff", padding: 0, width: "50%" }}>
                      <a href={homepageUrl} target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "none", whiteSpace: "nowrap" }}>P.IN.E.A Periodical</a>
                      <div style={{ height: "8px", lineHeight: "8px", fontSize: "8px" }}>&nbsp;</div>
                      <a href="mailto:office@pinea-periodical.com" target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "none", display: "block", fontSize: "13px", lineHeight: "13px", whiteSpace: "nowrap" }}>{language === "en" ? "Contact" : "Kontakt"}</a>
                      <a href="https://www.instagram.com/p.in.e.a/" target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "none", display: "block", fontSize: "13px", lineHeight: "13px", whiteSpace: "nowrap" }}>Instagram</a>
                    </td>
                    <td align="right" valign="bottom" style={{ padding: 0, width: "50%" }}>
                      <table role="presentation" border="0" cellPadding="0" cellSpacing="0" align="right" style={{ border: 0, marginLeft: "auto" }}>
                        <tbody><tr>
                          {footerLogos.map((logo, index) => (
                            <Fragment key={logo.id}>
                              <td valign="bottom" align="right" style={{ padding: 0 }}>{renderLogo(logo, logo.mobileWidth)}</td>
                              {index < footerLogos.length - 1 && <td width={gap} style={{ width: `${gap}px`, fontSize: "1px", lineHeight: "1px", padding: 0 }}>&nbsp;</td>}
                            </Fragment>
                          ))}
                        </tr></tbody>
                      </table>
                    </td>
                  </tr>

                  <tr className="footer-desktop-row" style={{ display: "none", maxHeight: 0, overflow: "hidden", msoHide: "all" }}>
                    <td align="left" valign="bottom" style={{ fontSize: "13px", lineHeight: "13px", color: "#fff", padding: 0 }}>
                      <a href={homepageUrl} target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "none", whiteSpace: "nowrap" }}>P.IN.E.A Periodical</a>
                    </td>
                    <td align="right" valign="bottom" style={{ padding: 0, width: `${rightBlockWidth}px`, minWidth: `${rightBlockWidth}px`, whiteSpace: "nowrap" }}>
                      <table role="presentation" border="0" cellPadding="0" cellSpacing="0" width={rightBlockWidth} style={{ border: 0, width: `${rightBlockWidth}px`, tableLayout: "fixed" }}>
                        <tbody><tr>
                          <td width={linksWidth} valign="bottom" style={{ width: `${linksWidth}px`, textAlign: "left", padding: 0, whiteSpace: "nowrap" }}>
                            <a href="mailto:office@pinea-periodical.com" target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "none", display: "block", fontSize: "13px", lineHeight: "13px", whiteSpace: "nowrap" }}>{language === "en" ? "Contact" : "Kontakt"}</a>
                            <a href="https://www.instagram.com/p.in.e.a/" target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "none", display: "block", fontSize: "13px", lineHeight: "13px", whiteSpace: "nowrap" }}>Instagram</a>
                          </td>
                          <td width={gap} style={{ width: `${gap}px`, minWidth: `${gap}px`, fontSize: "1px", lineHeight: "1px", padding: 0 }}>&nbsp;</td>
                          {footerLogos.map((logo, index) => (
                            <Fragment key={logo.id}>
                              <td width={logo.desktopWidth} valign="bottom" align="right" style={{ width: `${logo.desktopWidth}px`, padding: 0 }}>{renderLogo(logo, logo.desktopWidth)}</td>
                              {index < footerLogos.length - 1 && <td width={gap} style={{ width: `${gap}px`, minWidth: `${gap}px`, fontSize: "1px", lineHeight: "1px", padding: 0 }}>&nbsp;</td>}
                            </Fragment>
                          ))}
                        </tr></tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <span dangerouslySetInnerHTML={{ __html: listmonkSafe("<!--<![endif]-->") }} />
    </>
  );
};

export default NewsletterFooter;
