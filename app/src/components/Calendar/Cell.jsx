import styles from "./Calendar.module.css";

const Cell = ({ children, className = "", typo, onClick, onMouseEnter, onMouseLeave }) => (
  <div
    className={`${styles.cell} ${className}`}
    typo={typo}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </div>
);

export default Cell;
