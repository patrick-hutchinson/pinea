import { PortableText } from "@portabletext/react";
import styles from "@/components/InterviewText/InterviewText.module.css";
import { forwardRef } from "react";
import { isValidElement } from "react";

const Text = forwardRef(({ text, className, typo, style }, ref) => {
  if (isValidElement(text)) {
    return text;
  }

  if (!Array.isArray(text)) {
    return text ? (
      <p typo={typo} className={className} style={style} ref={ref}>
        {text}
      </p>
    ) : null;
  }

  const portableValue = text.map((block, index) => {
    if (block?._type !== "block") return block;

    const nextBlock = text[index + 1];
    const nextStyle = nextBlock?._type === "block" ? nextBlock.style || "normal" : null;

    return {
      ...block,
      _nextStyle: nextStyle,
    };
  });

  const shouldCollapseTransitionSpacing = (value) => {
    const currentStyle = value?.style || "normal";
    const nextStyle = value?._nextStyle;
    const canCollapse = ["normal", "center"].includes(currentStyle) && ["normal", "center"].includes(nextStyle);

    return Boolean(nextStyle && currentStyle !== nextStyle && canCollapse);
  };

  const getBlockStyle = (value, blockStyle = {}) => {
    if (!shouldCollapseTransitionSpacing(value)) return blockStyle;

    return {
      ...blockStyle,
      marginBottom: 0,
    };
  };
  // Collect footnotes once (outside of render loops)
  const footnotes = text.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  return (
    <div className={className} typo={typo} ref={ref} style={style}>
      <PortableText
        value={portableValue}
        components={{
          block: {
            normal: ({ children, value }) => <p style={getBlockStyle(value, style || {})}>{children}</p>,
            center: ({ children, value }) => (
              <p
                style={getBlockStyle(value, {
                  ...(style || {}),
                  textAlign: "center",
                })}
              >
                {children}
              </p>
            ),
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
              const href = value?.href;
              if (!href) return children;

              // Check if external (optional)
              const isExternal = href.startsWith("http");

              return (
                <a
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={styles.link}
                >
                  {children}
                </a>
              );
            },
            footnote: ({ value, children }) => {
              const index = footnotes.findIndex((fn) => fn._key === value._key) + 1;

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
});

export default Text;
