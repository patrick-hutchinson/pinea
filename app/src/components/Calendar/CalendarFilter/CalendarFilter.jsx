"use client";

import { useEffect, useState, useContext, useMemo } from "react";

import { LanguageContext } from "@/context/LanguageContext";
import { formatDateLabel } from "./formatDateLabel";

import FilterDays from "./components/FilterDays";
import FilterMonths from "./components/FilterMonths";
import FilterYears from "./components/FilterYears";
import TagSelection from "./TagSelection";

import styles from "./CalendarFilter.module.css";

const CalendarFilter = ({
  events,
  onSearch,
  selectedLabels,
  setSelectedLabels,
  yearRange,
  showArchiveLink = false,
  showCurrentLink = false,
}) => {
  const { language } = useContext(LanguageContext);

  const [startDate, setStartDate] = useState(null); // Date | null
  const [endDate, setEndDate] = useState(null);

  const [draftDate, setDraftDate] = useState({ day: null, month: null, year: null });

  const [editing, setEditing] = useState("start"); // "start" | "end" | null

  const dateValueWidthCh = useMemo(() => {
    const locale = language === "de" ? "de-DE" : "en-US";
    const year = 2026;
    let maxLength = 0;

    for (let month = 0; month < 12; month += 1) {
      const label = new Date(year, month, 28).toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      maxLength = Math.max(maxLength, label.length);
    }

    // Extra room to absorb font differences and avoid edge clipping.
    return Math.max(16, maxLength + 1);
  }, [language]);

  useEffect(() => {
    if (!draftDate || !draftDate.day || !draftDate.month || !draftDate.year) return;

    const selectedDate = new Date(draftDate.year, draftDate.month, draftDate.day);

    if (editing === "start") {
      setStartDate(selectedDate);
      setEditing("end");

      setDraftDate({ day: null, month: null, year: null });
    } else {
      setEndDate(selectedDate);

      setDraftDate({ day: null, month: null, year: null });
    }
  }, [draftDate]);

  const handleFilter = () => {
    if (!startDate || !endDate) return;

    onSearch({
      startDate,
      endDate,
    });
  };

  const ClearButton = ({ editing }) => (
    <button
      className={styles.clear}
      onClick={(e) => {
        e.stopPropagation();
        editing === "start" ? setStartDate(null) : setEndDate(null);
        setEditing(editing);
      }}
    >
      ×
    </button>
  );

  const filterReady = startDate && endDate;

  return (
    <>
      <div className={styles.range}>
        <TagSelection
          events={events}
          onSearch={onSearch}
          selectedLabels={selectedLabels}
          setSelectedLabels={setSelectedLabels}
          showArchiveLink={showArchiveLink}
          showCurrentLink={showCurrentLink}
        />
        {/* START */}
        <div className={`${editing === "start" ? styles.active : ""} ${styles.label}`} onClick={() => setEditing("start")}>
          <span>{language === "en" ? "From:" : "Von:"}</span>{" "}
          <span className={styles.dateValue} style={{ "--date-value-ch": dateValueWidthCh }}>
            {startDate ? formatDateLabel(startDate, language) : ""}
            {startDate && <ClearButton editing="start" />}
          </span>
        </div>

        {/* END */}
        <div className={`${editing === "end" ? styles.active : ""} ${styles.label}`} onClick={() => setEditing("end")}>
          <span>{language === "en" ? "Until:" : "Bis:"}</span>{" "}
          <span className={styles.dateValue} style={{ "--date-value-ch": dateValueWidthCh }}>
            {endDate ? formatDateLabel(endDate, language) : ""}
            {endDate && <ClearButton editing="end" />}
          </span>
        </div>
      </div>

      <div className={styles.selection} style={{ position: "relative" }}>
        <FilterYears draftDate={draftDate} setDraftDate={setDraftDate} events={events} yearRange={yearRange} />
        <FilterMonths draftDate={draftDate} setDraftDate={setDraftDate} />
        <FilterDays draftDate={draftDate} setDraftDate={setDraftDate} />
      </div>

      <div className={styles.controls}>
        <button onClick={handleFilter} disabled={!filterReady} className={filterReady && styles.selected}>
          Search
        </button>

        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setEditing("start");
            onSearch?.(null, events, []);
          }}
          className={styles.reset}
        >
          Reset
        </button>
      </div>
    </>
  );
};

export default CalendarFilter;
