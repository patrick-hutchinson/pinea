"use client";

import { convertToPlainText } from "@/helpers/convertToPlainText";
import { translate } from "@/helpers/translate";

const WEBSITE_BASE_URL = "https://www.pinea-periodical.com";

// Keep Outlook-only markup inert until Listmonk evaluates Safe. Otherwise its
// HTML template parser strips conditional comments before delivery.
const listmonkSafe = (html) => `{{ Safe ${JSON.stringify(html).replace(/</g, "\\x3c").replace(/>/g, "\\x3e")} }}`;

const getBulletinHref = (bulletin, language) => {
  const directLink = bulletin?.link;

  if (typeof directLink === "string" && directLink.trim().length > 0) {
    if (/^(https?:\/\/|mailto:|tel:)/i.test(directLink)) return directLink;
    if (directLink.startsWith("/")) return `${WEBSITE_BASE_URL}${directLink}`;
    return `https://${directLink}`;
  }

  const slug = bulletin?.slug?.current;
  if (typeof slug === "string" && slug.length > 0) {
    if (bulletin?._type === "openCall") return `${WEBSITE_BASE_URL}/open-calls#${slug}`;
    if (bulletin?._type === "news") return `${WEBSITE_BASE_URL}/news#${slug}`;
  }

  return `${WEBSITE_BASE_URL}/${language}/open-calls`;
};

const NewsletterBulletin = ({ block, language }) => {
  const sectionHeader =
    typeof block.sectionHeader === "string" ? block.sectionHeader.toLocaleUpperCase(language) : block.sectionHeader;

  return (
    <table
      className="newsletter-bulletin-list newsletter-module-gap"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      border="0"
      style={{ border: 0, marginBottom: "75px", marginTop: "75px" }}
    >
      <tbody>
        <tr>
          <td
            className="newsletter-running-copy newsletter-bulletin-section-title"
            style={{ width: "100%", textAlign: "center", paddingBottom: "24px", fontSize: "16px", lineHeight: "18px" }}
          >
            {sectionHeader}
          </td>
        </tr>
        {Array.isArray(block?.bulletin) &&
          block.bulletin.map((bulletin) => {
            const titleText = convertToPlainText(translate(bulletin?.title, language));
            const teaserText = convertToPlainText(translate(bulletin?.teaser, language));

            return (
              <tr key={bulletin?._id || bulletin?._key || getBulletinHref(bulletin, language)}>
                <td>
                  <table className="border" width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                    <tbody>
                      <tr>
                        <td style={{ borderTop: "1px solid #000", fontSize: 0, lineHeight: 0, padding: "0px" }}>&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>

                  <table
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                    role="presentation"
                    style={{ backgroundColor: "transparent", border: 0 }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="headline"
                          style={{
                            background: "transparent",
                            color: "#000",
                            padding: "8px 0 24px 0",
                            width: "100%",
                          }}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: listmonkSafe(
                                '<!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="8" style="height:8px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr></table><![endif]-->',
                              ),
                            }}
                          />
                          <a
                            href={getBulletinHref(bulletin, language)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#000", textDecoration: "none" }}
                          >
                            <p
                              className="newsletter-bulletin-headline"
                              style={{
                                textTransform: "uppercase",
                                margin: 0,
                                fontWeight: "375",
                                fontSize: "20px",
                                lineHeight: "21px",
                              }}
                            >
                              {titleText}
                            </p>
                            <p
                              className="newsletter-bulletin-headline"
                              style={{
                                margin: 0,
                                fontWeight: "375",
                                fontSize: "20px",
                                lineHeight: "21px",
                              }}
                            >
                              {teaserText}
                            </p>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default NewsletterBulletin;
