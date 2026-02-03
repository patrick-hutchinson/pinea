"use client";

import { useEffect, useState, useContext, useRef } from "react";

import { LanguageContext } from "@/context/LanguageContext";
import { formatDateLabel } from "./formatDateLabel";

import FilterDays from "./components/FilterDays";
import FilterMonths from "./components/FilterMonths";
import FilterYears from "./components/FilterYears";

import styles from "./CalendarFilter.module.css";

const CalendarFilter = ({ events, onSearch }) => {
  const { language } = useContext(LanguageContext);

  const [startDate, setStartDate] = useState(null); // Date | null
  const [endDate, setEndDate] = useState(null);

  const [draftDate, setDraftDate] = useState({ day: null, month: null, year: null });

  const [editing, setEditing] = useState("start"); // "start" | "end" | null

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
        {/* START */}
        <div className={`${editing === "start" ? styles.active : ""} ${styles.label}`} onClick={() => setEditing("start")}>
          {language === "en" ? "From:" : "Von:"} {startDate && formatDateLabel(startDate, language)}
          {startDate && <ClearButton editing="start" />}
        </div>

        {/* END */}
        <div className={`${editing === "end" ? styles.active : ""} ${styles.label}`} onClick={() => setEditing("end")}>
          {language === "en" ? "Until:" : "Bis:"} {endDate && formatDateLabel(endDate, language)}
          {endDate && <ClearButton editing="end" />}
        </div>
      </div>

      <div className={styles.selection} style={{ position: "relative" }}>
        <FilterDays draftDate={draftDate} setDraftDate={setDraftDate} />
        <FilterMonths draftDate={draftDate} setDraftDate={setDraftDate} />
        <FilterYears draftDate={draftDate} setDraftDate={setDraftDate} events={events} />
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
