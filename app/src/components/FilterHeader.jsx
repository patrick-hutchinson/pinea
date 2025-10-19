const FilterHeader = ({ array, className, setActiveFilter }) => {
  return (
    <ul className={className} typo="h3">
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
