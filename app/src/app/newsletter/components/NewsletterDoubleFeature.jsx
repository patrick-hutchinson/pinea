const NewsletterDoubleFeature = ({ block, language }) => {
  console.log("announcement double feature:", block);
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
          align="center"
          valign="top"
          style={{
            display: "block",
            maxWidth: "100%",
            height: "calc(50vw * 1.25)",
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
            href={block.link}
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
                    src={block.story[0].image.url}
                    width="100%"
                    style={{ display: "block", objectFit: "cover", height: "auto" }}
                    alt=""
                  />
                </td>
              </tr>
            </table>
          </a>
        </td>

        {/* CARD 2 — 50% */}

        <td
          className="na-image"
          align="center"
          valign="top"
          style={{
            display: "block",
            maxWidth: "100%",
            height: "calc(50vw * 1.25)",
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
            href={block.link}
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
                    src={block.story[1].image.url}
                    width="100%"
                    style={{ display: "block", objectFit: "cover", height: "auto" }}
                    alt=""
                  />
                </td>
              </tr>
            </table>
          </a>
        </td>
      </tr>
    </table>
  );
};

export default NewsletterDoubleFeature;
