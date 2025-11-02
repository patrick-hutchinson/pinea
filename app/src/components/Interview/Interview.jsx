import { PortableText } from "@portabletext/react";

import styles from "./Interview.module.css";

const Interview = ({ text, className, typo, interviewers = [] }) => {
  const footnotes = text.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  return (
    <div className={className} typo={typo}>
      <PortableText
        value={text}
        components={{
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

export default Interview;
