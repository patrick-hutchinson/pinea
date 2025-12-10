import InterviewText from "@/components/InterviewText/InterviewText";

import styles from "./Longcopy.module.css";

const Longcopy = ({ text, className, allFootnotes, offset = 0, style }) => {
  return (
    <InterviewText
      text={text}
      allFootnotes={allFootnotes}
      offset={offset}
      typo="longcopy"
      className={`${styles.longcopy} ${className}`}
      style={style}
    />
  );
};

export default Longcopy;
