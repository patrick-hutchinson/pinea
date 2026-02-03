import styles from "../CalendarFilter.module.css";

const FilterYears = ({ draftDate, setDraftDate, events }) => {
  const years = (() => {
    const currentYear = new Date().getFullYear();

    const maxEndYear = Math.max(
      ...events.filter((e) => e.endDate).map((e) => new Date(e.endDate).getFullYear()),
      currentYear,
    );

    return Array.from({ length: maxEndYear - currentYear + 1 }, (_, i) => currentYear + i);
  })();

  return (
    <div className={styles.years}>
      {years.map((year) => {
        const isActive = draftDate.year === year; // check if this month is selected

        return (
          <button
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
