import { PortableText } from "@portabletext/react";

const Interview = ({ text, className, typo }) => {
  return (
    <div className={className} typo={typo}>
      <PortableText
        value={text}
        components={{
          marks: {
            speaker: ({ value, children }) => {
              const initials = value?.initials; // from GROQ
              return (
                <span style={{ display: "block", marginBottom: "1em" }}>
                  <span>{initials}: </span>
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

export default Interview;
