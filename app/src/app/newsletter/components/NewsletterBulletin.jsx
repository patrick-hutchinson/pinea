"use client";

import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";

const NewsletterBulletin = ({ block, language }) => {
  return (
    <div className="newsletter-bulletin-list" style={{ border: 0, marginBottom: "150px", marginTop: "150px" }}>
      {block.bulletin.map((bulletin) => (
        <>
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
                    overflow: "hidden",

                    background: "transparent",
                    color: "#000",

                    padding: "8px 0px",
                    paddingBottom: "24px",
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <a
                    href={`https://www.pinea-periodical.com/open-calls#${language}`}
                    target="_blank"
                    style={{ opacity: 1, color: "#000" }}
                  >
                    <div
                      style={{
                        fontSize: "22px",
                        lineHeight: "1",
                        position: "relative",
                        textTransform: "uppercase",
                        marginBottom: 0,
                        fontWeight: "375",

                        textIndent: 0,
                        left: 0,
                      }}
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
                        {translate(bulletin.title, language)}
                      </p>
                    </div>

                    <div style={{ fontSize: "28px", lineHeight: "1" }}>
                      <Text
                        style={{ margin: 0, fontWeight: "375", fontSize: "22px", lineHeight: "1" }}
                        text={translate(bulletin.teaser, language)}
                      />
                    </div>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      ))}
    </div>
  );
};

export default NewsletterBulletin;
