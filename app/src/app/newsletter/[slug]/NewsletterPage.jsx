"use client";

import NewsletterFooter from "../components/NewsletterFooter";
import NewsletterHeader from "../components/NewsletterHeader";

import { renderNewsletter } from "../helpers/renderNewsletter";
import NewsletterPineaIcon from "../components/NewsletterPineaIcon";

import styles from "../Newsletter.module.css";

const NewsletterPage = ({ site, newsletter }) => {
  const pageBuilder = Array.isArray(newsletter?.pageBuilder) ? newsletter.pageBuilder : [];

  return (
    <table
      role="presentation"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border="0"
      bgcolor="#EDEDED"
      className={`newsletter-root ${styles.main}`}
      style={{ backgroundColor: "#EDEDED", width: "100%" }}
    >
      <tbody>
        <tr>
          <td align="center" style={{ padding: 0 }}>
            <table
              role="presentation"
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              border="0"
              bgcolor="#FFFFFF"
              className={`container body-text ${styles.content}`}
              style={{
                width: "100%",
                maxWidth: "1440px",
                margin: "0 auto",
                backgroundColor: "#FFFFFF",
              }}
            >
              <tbody>
                <tr>
                  <td>
                    <NewsletterHeader newsletter={newsletter} />
                    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
                      <tbody>
                        <tr>
                          <td style={{ padding: "8px" }}>
                            <NewsletterPineaIcon />
                            {pageBuilder.map((block, index) => (
                              <table
                                key={block?._key || `${block?._type || "block"}-${index}`}
                                role="presentation"
                                width="100%"
                                cellPadding="0"
                                cellSpacing="0"
                                border="0"
                              >
                                <tbody>
                                  <tr>
                                    <td>{renderNewsletter(block, newsletter.language)}</td>
                                  </tr>
                                </tbody>
                              </table>
                            ))}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <NewsletterFooter language={newsletter.language} site={site} />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsletterPage;
