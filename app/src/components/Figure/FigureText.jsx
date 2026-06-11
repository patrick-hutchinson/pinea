import { PortableText } from "@portabletext/react";
import styles from "@/components/InterviewText/InterviewText.module.css";
import { forwardRef, isValidElement } from "react";

const FigureText = forwardRef(({ text, className, typo, style }, ref) => {
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
    if (typo === "h2") return false;

    const currentStyle = value?.style || "normal";
    const nextStyle = value?._nextStyle;
    const canCollapse = ["normal", "center"].includes(currentStyle) && ["normal", "center"].includes(nextStyle);

    return Boolean(nextStyle && currentStyle !== nextStyle && canCollapse);
  };

  const getBlockStyle = (value, blockStyle = {}) => {
    if (typo === "h2") return blockStyle;

    if (!shouldCollapseTransitionSpacing(value)) return blockStyle;

    return {
      ...blockStyle,
      marginBottom: 0,
    };
  };

  const isEmptyBlock = (value) =>
    !Array.isArray(value?.children) || value.children.every((child) => (child?.text || "").length === 0);

  const footnotes = text.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  return (
    <div className={className} typo={typo} ref={ref} style={style}>
      <PortableText
        value={portableValue}
        components={{
          block: {
            normal: ({ children, value }) => (
              <p style={getBlockStyle(value, { ...(style || {}), ...(typo === "h2" ? {} : { marginBottom: 0 }) })}>
                {isEmptyBlock(value) ? <br /> : children}
              </p>
            ),
            center: ({ children, value }) => (
              <p
                style={getBlockStyle(value, {
                  ...(style || {}),
                  textAlign: "center",
                  ...(typo === "h2" ? {} : { marginBottom: 0 }),
                })}
              >
                {isEmptyBlock(value) ? <br /> : children}
              </p>
            ),
            smallText: ({ children, value }) => (
              <p
                typo="longcopy"
                style={getBlockStyle(value, {
                  ...(style || {}),
                  ...(typo === "h2" ? {} : { marginBottom: 0 }),
                })}
              >
                {isEmptyBlock(value) ? <br /> : children}
              </p>
            ),
            smallTextCenter: ({ children, value }) => (
              <p
                typo="longcopy"
                style={getBlockStyle(value, {
                  ...(style || {}),
                  textAlign: "center",
                  ...(typo === "h2" ? {} : { marginBottom: 0 }),
                })}
              >
                {isEmptyBlock(value) ? <br /> : children}
              </p>
            ),
            normalNoGap: ({ children, value }) => (
              <p
                style={getBlockStyle(value, {
                  ...(style || {}),
                  ...(typo === "h2" ? {} : { marginBottom: 0 }),
                })}
              >
                {isEmptyBlock(value) ? <br /> : children}
              </p>
            ),
            centerNoGap: ({ children, value }) => (
              <p
                style={getBlockStyle(value, {
                  ...(style || {}),
                  textAlign: "center",
                  ...(typo === "h2" ? {} : { marginBottom: 0 }),
                })}
              >
                {isEmptyBlock(value) ? <br /> : children}
              </p>
            ),
          },
          hardBreak: () => <br />,
          marks: {
            speaker: ({ value, children }) => {
              const number = value?.person;

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

export default FigureText;
