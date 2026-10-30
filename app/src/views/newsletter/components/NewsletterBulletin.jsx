"use client";

import { Fragment } from "react";

import { convertToPlainText } from "@/helpers/convertToPlainText";
import { translate } from "@/helpers/translate";

const WEBSITE_BASE_URL = "https://www.pinea-periodical.com";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

// Keep Outlook-only markup inert until Listmonk evaluates Safe. Otherwise its
// HTML template parser strips conditional comments before delivery.
const listmonkSafe = (html) => `{{ Safe ${JSON.stringify(html).replace(/</g, "\\x3c").replace(/>/g, "\\x3e")} }}`;

const renderOutlookBulletin = ({ href, title, teaser }) =>
  listmonkSafe(`<!--[if mso]><tr><td style="padding:0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="height:1px;padding:0;border-top:1px solid #000000;font-size:0;line-height:0;mso-line-height-rule:exactly;"></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="10" style="height:10px;padding:0;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr><tr><td style="padding:0;color:#000000;text-transform:uppercase;font-weight:375;font-size:24px;line-height:24px;mso-line-height-rule:exactly;"><a href="${escapeHtml(href)}" target="_blank" style="color:#000000;text-decoration:none;">${escapeHtml(title)}</a></td></tr><tr><td style="padding:0 0 24px;color:#000000;font-weight:375;font-size:24px;line-height:24px;mso-line-height-rule:exactly;"><a href="${escapeHtml(href)}" target="_blank" style="color:#000000;text-decoration:none;">${escapeHtml(teaser)}</a></td></tr></table></td></tr><![endif]-->`);

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
      className="newsletter-bulletin-list"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      border="0"
      style={{ border: 0 }}
    >
      <tbody>
        <span
          dangerouslySetInnerHTML={{
            __html: listmonkSafe("<!--[if !mso]><!-->"),
          }}
        />
        <tr>
          <td
            className="newsletter-running-copy newsletter-bulletin-section-title"
            style={{ width: "100%", textAlign: "center", paddingBottom: "24px", fontSize: "16px", lineHeight: "18px" }}
          >
            {sectionHeader}
          </td>
        </tr>
        <span
          dangerouslySetInnerHTML={{
            __html: listmonkSafe("<!--<![endif]-->"),
          }}
        />
        <span
          dangerouslySetInnerHTML={{
            __html: listmonkSafe(`<!--[if mso]><tr><td class="newsletter-bulletin-section-title" align="center" height="21" style="height:21px;padding:0;font-size:19px;line-height:21px;mso-line-height-rule:exactly;text-align:center;">${escapeHtml(sectionHeader)}</td></tr><tr><td height="10" style="height:10px;padding:0;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr><![endif]-->`),
          }}
        />
        {Array.isArray(block?.bulletin) &&
          block.bulletin.map((bulletin) => {
            const titleText = convertToPlainText(translate(bulletin?.title, language));
            const teaserText = convertToPlainText(translate(bulletin?.teaser, language));
            const href = getBulletinHref(bulletin, language);

            return (
              <Fragment key={bulletin?._id || bulletin?._key || href}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: listmonkSafe("<!--[if !mso]><!-->"),
                  }}
                />
                <tr>
                <td>
                  <table className="border" width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                    <tbody>
                      <tr>
                        <td height="1" style={{ borderTop: "1px solid #000", fontSize: 0, lineHeight: 0, height: "1px", padding: 0 }} />
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
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#000", textDecoration: "none" }}
                          >
                            <div
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
                            </div>
                            <div
                              className="newsletter-bulletin-headline"
                              style={{
                                margin: 0,
                                fontWeight: "375",
                                fontSize: "20px",
                                lineHeight: "21px",
                              }}
                            >
                              {teaserText}
                            </div>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                </tr>
                <span
                  dangerouslySetInnerHTML={{
                    __html: listmonkSafe("<!--<![endif]-->"),
                  }}
                />
                <span
                  dangerouslySetInnerHTML={{
                    __html: renderOutlookBulletin({ href, title: titleText, teaser: teaserText }),
                  }}
                />
              </Fragment>
            );
          })}
      </tbody>
    </table>
  );
};

export default NewsletterBulletin;
