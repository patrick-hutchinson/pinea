import styles from "./HomePage.module.css";

const Section = ({ children, className }) => {
  return <section className={`${styles.section} ${className}`}>{children}</section>;
};

export default Section;
