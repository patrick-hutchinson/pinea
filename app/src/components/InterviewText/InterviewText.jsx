import { PortableText } from "@portabletext/react";

import styles from "./InterviewText.module.css";

const Interview = ({ text, className, typo, interviewers = [] }) => {
  const footnotes = text.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  const circledNumbers = {
    0: "⓿",
    1: "❶",
    2: "❷",
    3: "❸",
    4: "❹",
    5: "❺",
    6: "❻",
    7: "❼",
    8: "❽",
    9: "❾",
  };

  return (
    <div className={className} typo={typo}>
      <PortableText
        value={text}
        components={{
          block: {
            center: ({ children }) => <p style={{ textAlign: "center" }}>{children}</p>,
            separator: ({ children }) => <div className={styles.separator}>{children}</div>,
          },
          marks: {
            speaker: ({ value, children }) => {
              const initials = value?.initials;
              const id = value?._id || value?.ref?._ref;

              // Determine if this speaker is an interviewer
              const isInterviewer = interviewers.some((i) => (i._id ? i._id === id : i.initials === initials));

              return (
                <span
                  className={isInterviewer ? styles.interviewer : styles.interviewee}
                  style={{ display: "block", marginBottom: "1em" }}
                >
                  <span typo="h5" className={styles.initials}>
                    {initials}
                  </span>
                  {children}
                </span>
              );
            },
            contributor: ({ value, children }) => {
              const initials = value?.initials;
              const id = value?._id || value?.ref?._ref;

              // Determine if this speaker is an interviewer
              const isInterviewer = interviewers.some((i) => (i._id ? i._id === id : i.initials === initials));

              return (
                <span
                  className={isInterviewer ? styles.interviewer : styles.interviewee}
                  style={{ display: "block", marginBottom: "1em" }}
                >
                  <span typo="h5" className={styles.initials}>
                    {initials}
                  </span>
                  {children}
                </span>
              );
            },
            footnote: ({ value, children }) => {
              const index = footnotes.findIndex((fn) => fn._key === value._key) + 1;

              const scrollToFootnote = () => {
                const el = document.getElementById(`footnote-${index}`);
                if (el) {
                  el.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              };

              return (
                <span>
                  {children}
                  <sup id={`ref-${index}`} style={{ cursor: "pointer" }} onClick={scrollToFootnote}>
                    {circledNumbers[index]}
                  </sup>
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
          },
        }}
      />
    </div>
  );
};

export default Interview;
