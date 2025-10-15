import styles from "./Calendar.module.css";

const Cell = ({ children, className = "", typo, onClick }) => (
  <div className={`${styles.cell} ${className}`} typo={typo} onClick={onClick}>
    {children}
  </div>
);

export default Cell;
