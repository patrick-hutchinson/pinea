"use client";

import Label from "@/components/Label/Label";

import Text from "@/components/Text/Text";

const NewsletterNewsElement = ({ title, text, label }) => {
  return (
    <>
      <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
        <tbody>
          <tr>
            <td style={{ borderTop: "1px solid #000", fontSize: 0, lineHeight: 0 }}>&nbsp;</td>
          </tr>
        </tbody>
      </table>

      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        style={{ backgroundColor: "transparent" }}
      >
        <tbody>
          <tr>
            <td
              className="headline"
              style={{
                overflow: "hidden",

                background: "transparent",
                color: "#000",

                padding: "12px",
                position: "relative",
                width: "100%",
              }}
            >
              {/* {label && <Label className={styles.label}>{label}</Label>} */}
              <div
                style={{
                  fontSize: "42px",
                  lineHeight: "1",
                  position: "relative",
                  textTransform: "uppercase",
                  marginBottom: 0,

                  textIndent: 0,
                  left: 0,
                }}
              >
                <Text text={title} />
              </div>

              <div style={{ fontSize: "42px", lineHeight: "1" }}>
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
