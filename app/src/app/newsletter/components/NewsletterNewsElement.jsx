"use client";

import Label from "@/components/Label/Label";

import Text from "@/components/Text/Text";

const NewsletterNewsElement = ({ title, text, label }) => {
  return (
    <>
      <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ border: 0 }}>
        <tbody>
          <tr>
            <td className="border" style={{ borderTop: "1px solid #000", fontSize: 0, lineHeight: 0, padding: "0px" }}>
              &nbsp;
            </td>
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
                // padding: "12px",
                padding: "12px 0px",
                paddingBottom: "24px",
                position: "relative",
                width: "100%",
              }}
            >
              {/* {label && <Label className={styles.label}>{label}</Label>} */}
              <div
                style={{
                  fontSize: "28px",
                  lineHeight: "1",
                  position: "relative",
                  textTransform: "uppercase",
                  marginBottom: 0,

                  textIndent: 0,
                  left: 0,
                }}
              >
                <p style={{ textTransform: "uppercase", margin: 0 }}>{title}</p>
              </div>

              <div style={{ fontSize: "28px", lineHeight: "1" }}>
                <Text text={text} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default NewsletterNewsElement;
