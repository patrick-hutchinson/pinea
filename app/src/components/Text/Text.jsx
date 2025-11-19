import { PortableText } from "@portabletext/react";

const Text = ({ text, className, typo }) => {
  if (!Array.isArray(text)) {
    return text ? (
      <p typo={typo} className={className}>
        {text}
      </p>
    ) : null;
  }
  // Collect footnotes once (outside of render loops)
  const footnotes = text.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  return (
    <div className={className} typo={typo}>
      <PortableText
        value={text}
        components={{
          block: {
            center: ({ children }) => <p style={{ textAlign: "center" }}>{children}</p>,
          },
          marks: {
            speaker: ({ value, children }) => {
              const number = value?.person;
              // Output "1; " followed by the text, visually separated
              return (
                <span style={{ display: "block", marginBottom: "1em" }}>
                  <strong>{number}; </strong>
                  {children}
                </span>
              );
            },
            link: ({ value, children }) => {
              const href = value?.href || value?.link;
              return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              );
            },
            footnote: ({ value, children }) => {
              const index = footnotes.findIndex((fn) => fn._key === value._key) + 1;
              console.log(value, "value of footnote");
              return (
                <span>
                  {children}
                  <sup id={`ref-${index}`}>
                    <a href={`#footnote-${index}`}>{index}</a>
                  </sup>
                </span>
              );
            },
          },
        }}
      />
    </div>
  );
};

export default Text;
