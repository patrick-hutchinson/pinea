"use client";

import { useEffect, useState, useContext, useRef } from "react";
import styles from "./CalendarFilter.module.css";

import { LanguageContext } from "@/context/LanguageContext";
import { formatDateLabel } from "./formatDateLabel";

const CalendarFilter = ({ events, onSearch }) => {
  const { language } = useContext(LanguageContext);

  const [startDate, setStartDate] = useState(null); // Date | null
  const [endDate, setEndDate] = useState(null);

  const [draftDay, setDraftDay] = useState(null);
  const [draftMonth, setDraftMonth] = useState(null);
  const [draftYear, setDraftYear] = useState(null);

  const [editing, setEditing] = useState("start"); // "start" | "end" | null

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  function isValidDay(year, month, day) {
    return day <= new Date(year, month + 1, 0).getDate();
  }

  const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString("en", { month: "long" }));
  const years = (() => {
    const currentYear = new Date().getFullYear();

    const maxEndYear = Math.max(
      ...events.filter((e) => e.endDate).map((e) => new Date(e.endDate).getFullYear()),
      currentYear,
    );

    return Array.from({ length: maxEndYear - currentYear + 1 }, (_, i) => currentYear + i);
  })();

  useEffect(() => {
    if (!draftDay || !draftMonth || !draftYear) return;

    const draftDate = new Date(draftYear, draftMonth, draftDay);

    if (editing === "start") {
      setStartDate(draftDate);
      setEditing("end");

      setDraftDay(null);
      setDraftMonth(null);
      setDraftYear(null);
    } else {
      setEndDate(draftDate);
      setDraftDay(null);
      setDraftMonth(null);
      setDraftYear(null);
    }
  }, [draftDay, draftMonth, draftYear]);

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
        setStartDate(null);
        setEditing(editing);
      }}
    >
      ×
    </button>
  );

  const Days = () => {
    // Only enable days if month & year are selected
    const monthSelected = draftMonth != null;
    const yearSelected = draftYear != null;

    return (
      <div className={styles.days}>
        {days.map((day) => {
          const valid = isValidDay(draftYear, draftMonth, day);
          const disabled = !monthSelected || !yearSelected || !valid;

          return (
            <button
              key={day}
              disabled={disabled}
              className={disabled ? styles.disabled : ""}
              onClick={() => {
                if (disabled) return;
                setDraftDay(day);
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    );
  };

  const Months = () => (
    <div className={styles.months}>
      {months.map((month, index) => (
        <button
          onClick={() => {
            setDraftMonth(index);
          }}
        >
          {month}
        </button>
      ))}
    </div>
  );

  const Years = () => (
    <div className={styles.years}>
      {years.map((year, index) => (
        <button
          onClick={() => {
            setDraftYear(year);
          }}
        >
          {year}
        </button>
      ))}
    </div>
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
        <Days />
        <Months />
        <Years />
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
