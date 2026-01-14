const NewsletterAnnouncements = ({ url }) => {
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
            width: "100%",
            maxWidth: "100%",
            height: "calc(50vw * 1.25)",
            // padding: "0px",
            paddingRight: "0px",
            height: "auto",
            marginBottom: "2.5px",
            padding: "12px 0px",
          }}
        >
          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ border: 0, height: "auto" }}>
            <tr>
              <td align="center" valign="middle" style={{ padding: "12px 0px" }}>
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
                  <h4 style={{ margin: 0, fontWeight: "normal" }}>Follow us on Instagram</h4>
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
            href="https://www.pinea-periodical.com/memberships"
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
                  <h4 style={{ margin: 0, fontWeight: "normal" }}>Become a Member</h4>
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
