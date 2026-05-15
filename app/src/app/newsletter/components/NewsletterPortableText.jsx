import { PortableText } from "@portabletext/react";

const NewsletterPortableText = ({ value, style = {} }) => {
  const safeValue = Array.isArray(value) ? value : [];
  const isEmptyBlock = (block) =>
    !Array.isArray(block?.children) || block.children.every((child) => (child?.text || "").length === 0);

  return (
    <PortableText
      value={safeValue}
      components={{
        block: {
          normal: ({ children, value: block }) => (
            <p style={{ ...style, margin: 0, textAlign: "left" }} align="left">
              {isEmptyBlock(block) ? <br /> : children}
            </p>
          ),
          center: ({ children, value: block }) => (
            <p style={{ ...style, margin: 0, textAlign: "center" }} align="center">
              {isEmptyBlock(block) ? <br /> : children}
            </p>
          ),
        },
        hardBreak: () => <br />,
        marks: {
          link: ({ value: linkValue, children }) => {
            const href = linkValue?.href;
            if (!href) return children;

            const isExternal = href.startsWith("http");

            return (
              <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
                {children}
              </a>
            );
          },
        },
      }}
    />
  );
};

export default NewsletterPortableText;
