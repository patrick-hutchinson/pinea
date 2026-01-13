const NewsletterAnnouncements = ({ url }) => {
  return (
    <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
      <tr>
        {/* IMAGE — 50% */}
        <td width="50%" align="center" valign="top" style={{ padding: "0px", paddingRight: "2px" }}>
          <table width="100%" height="220" cellPadding="0" cellSpacing="0" role="presentation" style={{ border: 0 }}>
            <tr>
              <td align="center" valign="middle" style={{ padding: 0 }}>
                <img src={url} width="100%" height="220" style={{ display: "block", objectFit: "cover" }} alt="" />
              </td>
            </tr>
          </table>
        </td>

        {/* CARD 1 — 25% */}
        <td width="25%" height="300" align="center" valign="top" style={{ padding: "0px", paddingRight: "2px" }}>
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
                  padding: "0px",
                  textAlign: "center",
                }}
              >
                <h4 style={{ margin: 0 }}>Follow us on Instagram</h4>
              </td>
            </tr>
          </table>
        </td>

        {/* CARD 2 — 25% */}
        <td width="25%" height="300" align="center" valign="top" style={{ padding: "0px" }}>
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
                  padding: "0px",
                  textAlign: "center",
                }}
              >
                <h4 style={{ margin: 0 }}>Become a Member</h4>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  );
};

export default NewsletterAnnouncements;
