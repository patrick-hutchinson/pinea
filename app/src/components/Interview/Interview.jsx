import { PortableText } from "@portabletext/react";

const Text = ({ text, className, typo }) => {
  // Collect footnotes once (outside of render loops)

  return (
    <div className={className} typo={typo}>
      <PortableText
        value={text}
        components={{
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
          },
        }}
      />
    </div>
  );
};

export default Text;
