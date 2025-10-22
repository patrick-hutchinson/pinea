import styles from "./FilterHeader.module.css";

const FilterHeader = ({ array, className, setActiveFilter }) => {
  return (
    <ul
      style={{ maxWidth: "100%", whiteSpace: "nowrap", overflowX: "scroll" }}
      className={styles.filter_header}
      typo="h3"
    >
      {array.map((item, index) => (
        <li key={index}>
          <span onClick={() => setActiveFilter(item)}>{item}</span>
          <span>{index < array.length - 1 && ", "}</span>
        </li>
      ))}
    </ul>
  );
};

export default FilterHeader;
