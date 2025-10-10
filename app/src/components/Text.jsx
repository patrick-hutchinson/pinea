import { PortableText } from "@portabletext/react";

const Text = ({ text }) => {
  return (
    <PortableText
      value={text}
      components={{
        marks: {
          link: ({ value, children }) => {
            const href = value?.href || value?.link;
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
        },
      }}
    />
  );
};

export default Text;
