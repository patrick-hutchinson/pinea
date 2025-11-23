import InterviewText from "@/components/InterviewText/InterviewText";

import styles from "./Longcopy.module.css";

const Longcopy = ({ text, className }) => {
  return <InterviewText text={text} typo="longcopy" className={`${styles.longcopy} ${className}`} />;
};

export default Longcopy;
