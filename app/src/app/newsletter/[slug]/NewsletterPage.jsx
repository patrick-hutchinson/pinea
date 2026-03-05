"use client";

import NewsletterFooter from "../components/NewsletterFooter";
import NewsletterHeader from "../components/NewsletterHeader";

import { renderNewsletter } from "../helpers/renderNewsletter";
import NewsletterPineaIcon from "../components/NewsletterPineaIcon";

import styles from "../Newsletter.module.css";

const NewsletterPage = ({ site, newsletter }) => {
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border="0"
      bgcolor="#EDEDED"
      className={styles.main}
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

                    <div style={{ padding: "13px" }}>
                      <NewsletterPineaIcon />
                      {newsletter.pageBuilder.map((block) => renderNewsletter(block, newsletter.language))}
                    </div>

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
