"use client";

import { useEffect, useState, useContext } from "react";
import styles from "../Calendar.module.css";
import { ScrollArea } from "@blur-ui/scroll-area";

import { LanguageContext } from "@/context/LanguageContext";

const DateSelection = ({ events, onSearch }) => {
  const { language } = useContext(LanguageContext);
  // const show = true;
  const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString("en", { month: "long" }));

  const years = [
    ...new Set(
      events.flatMap((event) => {
        const arr = [];
        if (event.startDate) arr.push(new Date(event.startDate).getFullYear());
        if (event.endDate) arr.push(new Date(event.endDate).getFullYear());
        return arr;
      })
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

  // const handleFilter = () => {
  //   if (startDate.month && startDate.year && endDate.month && endDate.year) {
  //     onSearch?.({ startDate, endDate }, events, selectedLabels);
  //     setEditing(null);
  //   }
  // };

  const handleFilter = () => {
    if (startDate.month && startDate.year && endDate.month && endDate.year) {
      onSearch?.({ startDate, endDate });
      setEditing(null);
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

  return (
    <>
      <div className={styles.range}>
        <div className={`${editing === "start" && styles.active} ${styles.label}`} onClick={() => setEditing("start")}>
          {language === "en" ? "From:" : "Von:"}{" "}
          {startDate.month && startDate.year ? `${startDate.month} ${startDate.year}` : ""}
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
          {endDate.month && endDate.year ? `${endDate.month} ${endDate.year}` : ""}
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

      <div className={styles.selection}>
        {["month", "year"].map((type) => (
          <ScrollArea
            classNames={{
              horizontalScrollbar: "h-2.5",
              root: "w-60 h-60 text-black dark:text-white",
              scrollbar: "p-[1px]",
              thumb: "bg-neutral-800 dark:bg-neutral-100 rounded-full opacity-30 hover:opacity-40 transition-opacity",
              verticalScrollbar: "w-2.5",
            }}
            dir="ltr"
            orientation="vertical"
            scrollHideDelay={600}
            shadowSize={40}
            type="hover"
          >
            <div key={type} className={type === "month" ? styles.months : styles.years}>
              {(type === "month" ? months : years).map((value, index) => {
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
          </ScrollArea>
        ))}
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
            onSearch?.(null);
          }}
          className={styles.reset}
        >
          Reset
        </button>
      </div>
    </>
  );
};

export default DateSelection;
