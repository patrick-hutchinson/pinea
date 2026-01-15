const NewsletterAnnouncements = ({ url, language }) => {
  return (
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={{ marginBottom: "150px", border: 0 }}
    >
      <tr>
        {/* IMAGE — 50% */}
        <td
          className="na-image"
          // width="50%"
          // height="300"
          align="center"
          valign="top"
          style={{
            display: "block",
            // width: "100%",
            maxWidth: "100%",
            height: "calc(50vw * 1.25)",
            // padding: "0px",
            paddingRight: "0px",
            height: "auto",

            padding: "50px 30px",

            maxWidth: "600px",
            margin: "0 auto",
            marginBottom: "150px",
          }}
        >
          <h5
            className="section-header"
            style={{
              display: "block",
              width: "100%",

              height: "auto",
              margin: "0 auto",
              marginBottom: "6px",
              lineHeight: 1,
              fontWeight: "normal",
              fontSize: "7.5px",
              textTransform: "uppercase",
              textAlign: "left",
            }}
          >
            Ad
          </h5>
          <a
            href={
              language === "en"
                ? "https://www.dieangewandte.at/en/news/detail?artikel_id=1765856539921"
                : "https://www.dieangewandte.at/aktuell/aktuell_detail?artikel_id=1765856539921"
            }
            target="_blank"
            style={{ display: "block", width: "100%", height: "100%", textDecoration: "none", opacity: 1 }}
          >
            <table
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              role="presentation"
              style={{ border: 0, height: "auto" }}
            >
              <tr>
                <td align="center" valign="middle" style={{ padding: "0px 0px" }}>
                  <img
                    src={url}
                    width="100%"
                    // height="300"
                    style={{ display: "block", objectFit: "cover", height: "auto" }}
                    alt=""
                  />
                </td>
              </tr>
            </table>
          </a>
        </td>

        {/* CARD 1 — 25% */}

        <td
          className="na-card"
          width="25%"
          height="300"
          align="center"
          valign="top"
          style={{
            display: "block",
            width: "calc(50% - 2px)",
            maxWidth: "100%",
            height: "calc(50vw * 1.25)",
            padding: "12px 0px",
            marginRight: "2px",
          }}
        >
          <a
            href="https://www.instagram.com/p.in.e.a/"
            target="_blank"
            style={{ display: "block", width: "100%", height: "100%", textDecoration: "none", opacity: 1 }}
          >
            <table
              width="100%"
              height="100%"
              cellPadding="0"
              cellSpacing="0"
              role="presentation"
              style={{ background: "#000", border: 0 }}
            >
              <tr>
                <td
                  align="center"
                  valign="middle"
                  style={{
                    color: "#fff",
                    padding: "12px",
                    padding: "12px 0px",
                    textAlign: "center",
                  }}
                >
                  <h4 style={{ margin: 0, fontWeight: "normal", fontSize: "19px", lineHeight: "21px" }}>
                    {language === "en" ? (
                      <div>
                        Follow us on <br /> Instagram
                      </div>
                    ) : (
                      <div>
                        Folge uns auf <br /> Instagram
                      </div>
                    )}
                  </h4>
                </td>
              </tr>
            </table>
          </a>
        </td>

        {/* CARD 2 — 25% */}
        <td
          className="na-card"
          width="25%"
          align="center"
          valign="top"
          height="300"
          style={{
            display: "block",
            width: "calc(50%)",
            maxWidth: "100%",
            height: "calc(50vw * 1.25)",
            // position: "relative",
            // left: "2px",

            padding: "12px 0px",
          }}
        >
          <a
            href={`https://www.pinea-periodical.com/memberships#${language}`}
            target="_blank"
            style={{ display: "block", width: "100%", height: "100%", textDecoration: "none", opacity: 1 }}
          >
            <table
              width="100%"
              height="100%"
              cellPadding="0"
              cellSpacing="0"
              role="presentation"
              style={{ background: "#000", border: 0 }}
            >
              <tr>
                <td
                  align="center"
                  valign="middle"
                  style={{
                    color: "#fff",
                    //  padding: "12px",

                    padding: "12px 0px",
                    textAlign: "center",
                  }}
                >
                  <h4 style={{ margin: 0, fontWeight: "normal", fontSize: "19px", lineHeight: "21px" }}>
                    {language === "en" ? (
                      <div>
                        Become a <br />
                        Member
                      </div>
                    ) : (
                      <div>
                        Werde P.IN.E.A <br /> Mitglied
                      </div>
                    )}
                  </h4>
                </td>
              </tr>
            </table>
          </a>
        </td>
      </tr>
    </table>
  );
};

export default NewsletterAnnouncements;
