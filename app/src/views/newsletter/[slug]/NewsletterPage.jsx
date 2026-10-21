"use client";

import { Fragment } from "react";

import NewsletterFooter from "../components/NewsletterFooter";
import NewsletterHeader from "../components/NewsletterHeader";

import { renderNewsletter } from "../helpers/renderNewsletter";
import NewsletterPineaIcon from "../components/NewsletterPineaIcon";

import styles from "../Newsletter.module.css";

// Keep Outlook-only markup inert until Listmonk evaluates Safe; otherwise its
// HTML template parser strips conditional comments before delivery.
const listmonkSafe = (html) => `{{ Safe ${JSON.stringify(html).replace(/</g, "\\x3c").replace(/>/g, "\\x3e")} }}`;

const NewsletterPage = ({ site, newsletter }) => {
  const pageBuilder = Array.isArray(newsletter?.pageBuilder) ? newsletter.pageBuilder : [];

  return (
    <>
      <style>{`
        .newsletter-root a,
        .newsletter-root a:visited {
          color: #000 !important;
          text-decoration: none !important;
        }

        .newsletter-root a:hover {
          opacity: 1 !important;
        }

        .newsletter-root .newsletter-header a,
        .newsletter-root .newsletter-header a:visited {
          color: #000 !important;
          text-decoration: none !important;
        }

        .newsletter-root .newsletter-footer a,
        .newsletter-root .newsletter-footer a:visited {
          color: #fff !important;
          text-decoration: none !important;
        }

        .newsletter-page-gutter {
          padding: 8px !important;
        }

        .newsletter-running-copy {
          font-size: 16px !important;
          line-height: 18px !important;
        }

        .newsletter-running-copy p {
          font-size: 16px !important;
          line-height: 18px !important;
        }

        .newsletter-bulletin-headline {
          font-size: 20px !important;
          line-height: 21px !important;
        }

        .newsletter-module-gap {
          margin-top: 75px !important;
          margin-bottom: 75px !important;
        }

        .newsletter-module-gap-bottom {
          padding-bottom: 75px !important;
        }

        .newsletter-module-gap-vertical {
          padding-top: 75px !important;
          padding-bottom: 75px !important;
        }

        .newsletter-running-gap {
          padding-bottom: 75px !important;
        }

        @media only screen and (min-width: 601px) {
          .newsletter-page-gutter {
            padding: 12px !important;
          }

          .newsletter-running-copy {
            font-size: 19px !important;
            line-height: 21px !important;
          }

          .newsletter-running-copy p {
            font-size: 19px !important;
            line-height: 21px !important;
          }

          .newsletter-bulletin-headline {
            font-size: 22px !important;
            line-height: 1 !important;
          }

          .newsletter-module-gap {
            margin-top: 120px !important;
            margin-bottom: 120px !important;
          }

          .newsletter-module-gap-bottom {
            padding-bottom: 120px !important;
          }

          .newsletter-module-gap-vertical {
            padding-top: 120px !important;
            padding-bottom: 120px !important;
          }

          .newsletter-running-gap {
            padding-bottom: 120px !important;
          }
        }

        a[x-apple-data-detectors],
        .x-apple-data-detectors,
        .x-apple-data-detectors *,
        .aBn {
          color: inherit !important;
          text-decoration: none !important;
          border-bottom: 0 !important;
        }
      `}</style>
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
                width="720"
                cellPadding="0"
                cellSpacing="0"
                border="0"
                align="center"
                bgcolor="#FFFFFF"
                className={`container body-text ${styles.content}`}
                style={{
                  width: "100%",
                  maxWidth: "720px",
                  margin: "0 auto",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <tbody>
                  <tr>
                    <td>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: listmonkSafe(`<!--[if mso]><style type="text/css">
                            .newsletter-bulletin-section-title {
                              font-size: 19px !important;
                              line-height: 21px !important;
                              mso-line-height-rule: exactly;
                              padding: 0 !important;
                            }
                            .newsletter-bulletin-headline {
                              font-size: 24px !important;
                              line-height: 24px !important;
                              mso-line-height-rule: exactly;
                            }
                            .newsletter-bulletin-list .headline {
                              padding: 0 0 24px !important;
                              mso-padding-alt: 0 0 24px 0;
                            }
                            table.newsletter-bulletin-list {
                              margin: 0 !important;
                              padding: 0 !important;
                              border-collapse: collapse !important;
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                            }
                            .newsletter-announcements .newsletter-running-copy {
                              font-size: 19px !important;
                              line-height: 21px !important;
                              mso-line-height-rule: exactly;
                            }
                            .newsletter-module-gap {
                              margin-top: 0 !important;
                              margin-bottom: 0 !important;
                            }
                            .newsletter-running-gap,
                            .newsletter-module-gap-bottom {
                              padding-bottom: 0 !important;
                            }
                            .newsletter-adBanner .newsletter-adBanner-content {
                              padding-top: 0 !important;
                              padding-bottom: 0 !important;
                            }
                          </style><![endif]-->`),
                        }}
                      />
                      <NewsletterHeader newsletter={newsletter} />
                      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
                        <tbody>
                          <tr>
                            <td className="newsletter-page-gutter" style={{ padding: "8px" }}>
                              <NewsletterPineaIcon />
                              {pageBuilder.map((block, index) => (
                                <Fragment key={block?._key || `${block?._type || "block"}-${index}`}>
                                  {index > 0 && (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        // Outlook ignores table margins inconsistently, so use a physical row
                                        // for the shared section gap instead of relying on CSS padding.
                                        __html: listmonkSafe(
                                          '<!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="100" style="height:100px;padding:0;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr></table><![endif]-->',
                                        ),
                                      }}
                                    />
                                  )}
                                  <table
                                    role="presentation"
                                    width="100%"
                                    cellPadding="0"
                                    cellSpacing="0"
                                    border="0"
                                  >
                                    <tbody>
                                      <tr>
                                        <td className="newsletter-block">{renderNewsletter(block, newsletter.language)}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Fragment>
                              ))}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <span
                        dangerouslySetInnerHTML={{
                          // Outlook does not consistently preserve vertical cell padding on the footer.
                          // Keep this as a physical row so the final module always has a 100px section gap.
                          __html: listmonkSafe(
                            '<!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="100" style="height:100px;padding:0;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr></table><![endif]-->',
                          ),
                        }}
                      />
                      <NewsletterFooter language={newsletter.language} site={site} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default NewsletterPage;
