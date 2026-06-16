import styles from "../CalendarFilter.module.css";

const FilterYears = ({ draftDate, setDraftDate, events, yearRange }) => {
  const years = (() => {
    if (yearRange?.startYear && yearRange?.endYear && yearRange.endYear >= yearRange.startYear) {
      return Array.from(
        { length: yearRange.endYear - yearRange.startYear + 1 },
        (_, index) => yearRange.startYear + index,
      );
    }

    const currentYear = new Date().getFullYear();

    const maxEndYear = Math.max(
      ...events.filter((e) => e.endDate).map((e) => new Date(e.endDate).getFullYear()),
      currentYear,
    );

    return Array.from({ length: maxEndYear - currentYear + 1 }, (_, i) => currentYear + i);
  })();

  return (
    <div className={styles.years} data-lenis-prevent>
      {years.map((year, index) => {
        const isActive = draftDate.year === year; // check if this month is selected

        return (
          <button
            key={index}
            className={isActive ? styles.active : ""}
            onClick={() => setDraftDate((prev) => ({ ...prev, year: year }))}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
};

export default FilterYears;
