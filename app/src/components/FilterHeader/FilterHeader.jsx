import { useRef, useEffect } from "react";
import styles from "./FilterHeader.module.css";

const FilterHeader = ({ array, handleFilter, currentlyActive }) => {
  const itemRefs = useRef({}); // store refs for all items

  // when the active item changes → scroll it into view
  useEffect(() => {
    if (currentlyActive && itemRefs.current[currentlyActive]) {
      itemRefs.current[currentlyActive].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentlyActive]);

  return (
    <ul
      style={{ maxWidth: "100%", whiteSpace: "nowrap", overflowX: "auto" }}
      className={styles.filter_header}
      typo="h3"
    >
      {array.map((item, index) => {
        const isActive = currentlyActive === item;
        return (
          <li
            key={index}
            ref={(el) => (itemRefs.current[item] = el)} // attach ref
            className={isActive ? styles.active : ""}
          >
            <span onClick={() => handleFilter(item)}>{item}</span>
            <span>{index < array.length - 1 && ", "}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default FilterHeader;
