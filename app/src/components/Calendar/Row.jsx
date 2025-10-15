import styles from "./Calendar.module.css";

const Row = ({ children, className = "", typo }) => (
  <li className={`${styles.row} ${className}`} typo={typo}>
    {children}
  </li>
);

export default Row;
