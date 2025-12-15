const NewsletterHeader = ({ newsletter }) => {
  return (
    <table
      width="100%"
      border="0"
      cellPadding="0"
      cellSpacing="0"
      style={{
        backgroundColor: "#000",
        padding: "12px",
        height: "50px",
        border: "0px",
      }}
    >
      <tbody>
        <tr>
          {/* LEFT SIDE (Desktop only) */}
          <td
            align="left"
            valign="top"
            style={{
              fontSize: "13px",
              lineHeight: "13px",
              color: "#fff",
              padding: "0",
              margin: "0",
            }}
          >
            <a
              href="https://www.pinea-periodical.com"
              target="_blank"
              style={{
                color: "#fff",
                textDecoration: "none",
              }}
            >
              P.IN.E.A Periodical
            </a>
          </td>

          {/* RIGHT SIDE */}
          <td align="right" valign="top" className="mobile-footer-links" style={{ border: "none", padding: "0px" }}>
            <div style={{ fontSize: "13px", lineHeight: "13px", color: "#fff", padding: "0", margin: "0" }}>
              {newsletter.release}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsletterHeader;
