import { PortableText } from "@portabletext/react";

const Text = ({ text, className, fontSize }) => {
  return (
    <div className={`${className} ${fontSize}`}>
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
    </div>
  );
};

export default Text;
