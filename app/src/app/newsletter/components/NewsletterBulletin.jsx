"use client";

import { convertToPlainText } from "@/helpers/convertToPlainText";
import { translate } from "@/helpers/translate";

const WEBSITE_BASE_URL = "https://www.pinea-periodical.com";

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

  return `${WEBSITE_BASE_URL}/open-calls#${language}`;
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
      style={{ border: 0, marginBottom: "150px", marginTop: "150px" }}
    >
      <tbody>
        <tr>
          <td style={{ width: "100%", textAlign: "center", paddingBottom: "24px", fontSize: "19px", lineHeight: "21px" }}>
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
                          <a
                            href={getBulletinHref(bulletin, language)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#000", textDecoration: "none" }}
                          >
                            <p
                              style={{
                                textTransform: "uppercase",
                                margin: 0,
                                fontWeight: "375",
                                fontSize: "22px",
                                lineHeight: "1",
                              }}
                            >
                              {titleText}
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: "375",
                                fontSize: "22px",
                                lineHeight: "1",
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
