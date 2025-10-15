"use client";

import { useState } from "react";
import styles from "../Calendar.module.css";

const DateSelection = ({ events, onSearch }) => {
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
    if (editing === "start") setStartDate((prev) => ({ ...prev, [type]: value }));
    if (editing === "end") setEndDate((prev) => ({ ...prev, [type]: value }));
  };

  const handleConfirm = () => {
    if (editing === "start" && startDate.month && startDate.year) setEditing("end");
    else if (editing === "end" && endDate.month && endDate.year) setEditing(null);
    if (startDate.month && startDate.year && endDate.month && endDate.year) {
      onSearch?.({ startDate, endDate });
    }
  };

  return (
    <div className={styles.date_selection} typo="h4">
      <div className={styles.range}>
        <div className={styles.label} onClick={() => setEditing("start")}>
          From: {startDate.month && startDate.year ? `${startDate.month} ${startDate.year}` : "-"}
          {startDate.month && startDate.year && (
            <button
              className={styles.clear}
              onClick={() => {
                setStartDate({ month: "", year: "" });
                setEditing("start");
              }}
            >
              ×
            </button>
          )}
        </div>
        <div className={styles.label} onClick={() => setEditing("end")}>
          Until: {endDate.month && endDate.year ? `${endDate.month} ${endDate.year}` : "-"}
          {endDate.month && endDate.year && (
            <button
              className={styles.clear}
              onClick={() => {
                setEndDate({ month: "", year: "" });
                setEditing("end");
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {editing && (
        <div className={styles.selection}>
          {["month", "year"].map((type) => (
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
          ))}
        </div>
      )}

      <div className={styles.controls}>
        {editing && (
          <>
            <button
              onClick={handleConfirm}
              disabled={!(editing === "start" ? startDate.month && startDate.year : endDate.month && endDate.year)}
            >
              {editing === "end" ? "Search" : "✓"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DateSelection;
