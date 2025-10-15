import styles from "./Calendar.module.css";

const Cell = ({ children, className = "", typo, onMouseEnter, onMouseLeave }) => (
  <div className={`${styles.cell} ${className}`} typo={typo} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    {children}
  </div>
);

export default Cell;
