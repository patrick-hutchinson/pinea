"use client";

import { useEffect, useState, useContext, useRef } from "react";
import styles from "./CalendarFilter.module.css";

import { LanguageContext } from "@/context/LanguageContext";

const CalendarFilter = ({ events, onSearch, setShowFilter, setSelectedLabels }) => {
  const { language } = useContext(LanguageContext);

  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const [monthFade, setMonthFade] = useState({ top: false, bottom: false });
  const [yearFade, setYearFade] = useState({ top: false, bottom: false });

  const updateFadeFor = (ref, setFade) => {
    const el = ref.current;
    if (!el) return;
    setFade({
      top: el.scrollTop > 0,
      bottom: el.scrollTop + el.clientHeight < el.scrollHeight,
    });
  };

  // const show = true;
  const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString("en", { month: "long" }));

  const years = [
    ...new Set(
      events.flatMap((event) => {
        const arr = [];
        if (event.startDate) arr.push(new Date(event.startDate).getFullYear());
        if (event.endDate) arr.push(new Date(event.endDate).getFullYear());
        return arr;
      }),
    ),
  ].sort((a, b) => a - b);

  const [startDate, setStartDate] = useState({ month: "", year: "" });
  const [endDate, setEndDate] = useState({ month: "", year: "" });
  const [editing, setEditing] = useState("start"); // "start" | "end" | null

  const handleSelect = (type, value) => {
    if (editing === "start") {
      setStartDate((prev) => {
        const updated = { ...prev, [type]: value };

        // Once both month & year are chosen for startDate → switch to endDate
        if (type === "year" && updated.month && updated.year) {
          setEditing("end");
        }
        return updated;
      });
    }

    if (editing === "end") {
      setEndDate((prev) => ({ ...prev, [type]: value }));
    }
  };

  const handleFilter = () => {
    setShowFilter(false);

    if (startDate.month && startDate.year && endDate.month && endDate.year) {
      onSearch?.({ startDate, endDate });
      setEditing(null);

      const el = document.querySelector(`section.${styles.calendar}`);
      const top = el.getBoundingClientRect().top + window.scrollY - 30;

      window.scrollTo({ top: top, behavior: "smooth" });
    }
  };

  const filterReady = startDate.month && startDate.year && endDate.month && endDate.year;

  const monthNames = {
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    de: [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember",
    ],
  };

  function getLocalizedMonthName(month, language, monthNames) {
    if (!month) return "";

    // If month is a number (1–12)
    if (typeof month === "number") {
      return monthNames[language][month - 1];
    }

    // If month is an English string
    const index = monthNames.en.indexOf(month);
    if (index !== -1) return monthNames[language][index];

    return month; // fallback
  }

  useEffect(() => {
    const monthEl = monthRef.current;
    const yearEl = yearRef.current;

    if (!monthEl || !yearEl) return;

    const updateMonth = () => updateFadeFor(monthRef, setMonthFade);
    const updateYear = () => updateFadeFor(yearRef, setYearFade);

    updateMonth();
    updateYear();

    monthEl.addEventListener("scroll", updateMonth);
    yearEl.addEventListener("scroll", updateYear);
    window.addEventListener("resize", updateMonth);
    window.addEventListener("resize", updateYear);

    return () => {
      monthEl.removeEventListener("scroll", updateMonth);
      yearEl.removeEventListener("scroll", updateYear);
      window.removeEventListener("resize", updateMonth);
      window.removeEventListener("resize", updateYear);
    };
  }, [events]);

  return (
    <>
      <div className={styles.range}>
        <div className={`${editing === "start" && styles.active} ${styles.label}`} onClick={() => setEditing("start")}>
          {language === "en" ? "From:" : "Von:"}{" "}
          {startDate.month && startDate.year
            ? `${getLocalizedMonthName(startDate.month, language, monthNames)} ${startDate.year}`
            : ""}
          {startDate.month && startDate.year && (
            <button
              className={styles.clear}
              onClick={(e) => {
                e.stopPropagation();
                setStartDate({ month: "", year: "" });
                setEditing("start");
              }}
            >
              ×
            </button>
          )}
        </div>
        <div className={`${editing === "end" && styles.active} ${styles.label}`} onClick={() => setEditing("end")}>
          {language === "en" ? "Until:" : "Bis:"}{" "}
          {endDate.month && endDate.year
            ? `${getLocalizedMonthName(endDate.month, language, monthNames)} ${endDate.year}`
            : ""}
          {endDate.month && endDate.year && (
            <button
              className={styles.clear}
              onClick={(e) => {
                e.stopPropagation();
                setEndDate({ month: "", year: "" });
                setEditing("end");
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className={styles.selection} style={{ position: "relative" }}>
        {["month", "year"].map((type) => {
          const nowYear = new Date().getFullYear();
          const list =
            type === "year"
              ? years.filter((y) => y >= nowYear) // exclude past years
              : months;

          return (
            <div
              key={type}
              className={type === "month" ? styles.months : styles.years}
              ref={type === "month" ? monthRef : yearRef}
            >
              {list.map((value, index) => {
                const current = editing === "start" ? startDate : endDate;
                const isSelected = current[type] === value;

                // Determine displayValue
                let displayValue = value;
                if (type === "month") {
                  if (typeof value === "number") {
                    // numeric months 1-12
                    displayValue = monthNames[language][value - 1];
                  } else if (typeof value === "string") {
                    // assume English string month, find index and translate
                    const monthIndex = monthNames.en.indexOf(value);
                    if (monthIndex !== -1) displayValue = monthNames[language][monthIndex];
                  }
                }

                return (
                  <button
                    key={value}
                    className={isSelected ? styles.selected : ""}
                    onClick={() => handleSelect(type, value)}
                  >
                    {displayValue}
                  </button>
                );
              })}
            </div>
          );
        })}

        {monthFade.top && <div className={styles.fade_top} />}
        {monthFade.bottom && <div className={styles.fade_bottom} />}

        {/* Year fades */}
        {yearFade.top && <div className={styles.fade_top} />}
        {yearFade.bottom && <div className={styles.fade_bottom} />}
      </div>

      <div className={styles.controls}>
        <button onClick={handleFilter} disabled={!filterReady} className={filterReady && styles.selected}>
          Search
        </button>

        <button
          onClick={() => {
            setStartDate({ month: "", year: "" });
            setEndDate({ month: "", year: "" });
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
