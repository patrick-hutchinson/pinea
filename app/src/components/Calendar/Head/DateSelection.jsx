"use client";

import { useEffect, useState } from "react";
import styles from "../Calendar.module.css";
import { ScrollArea } from "@blur-ui/scroll-area";

const DateSelection = ({ events, onSearch }) => {
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

  return (
    <>
      <div className={styles.range}>
        <div className={`${editing === "start" && styles.active} ${styles.label}`} onClick={() => setEditing("start")}>
          From: {startDate.month && startDate.year ? `${startDate.month} ${startDate.year}` : ""}
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
          Until: {endDate.month && endDate.year ? `${endDate.month} ${endDate.year}` : ""}
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
              {(type === "month" ? months : years).map((value) => {
                const current = editing === "start" ? startDate : endDate;
                const isSelected = current[type] === value;
                return (
                  <button
                    key={value}
                    className={isSelected ? styles.selected : ""}
                    onClick={() => handleSelect(type, value)}
                  >
                    {value}
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
