"use client";

import { useState } from "react";
import styles from "../Calendar.module.css";

import { AnimatePresence, motion, scale } from "framer-motion";

const DateSelection = ({ events, onSearch, show }) => {
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

  const handleFilter = () => {
    if (startDate.month && startDate.year && endDate.month && endDate.year) {
      onSearch?.({ startDate, endDate });
      setEditing(null);
    }
  };

  const filterReady = startDate.month && startDate.year && endDate.month && endDate.year;

  const scaleVariants = {
    hidden: {
      maxHeight: 0,
      transition: { delay: 0.3, duration: 0.4, ease: "easeInOut" }, // delay applies here
    },
    visible: {
      maxHeight: 150,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  const opacityVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        opacity: { delay: 0.3, duration: 0.2, ease: "easeInOut" },
      },
    },
  };

  return (
    <motion.div
      className={styles.date_selection}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      variants={scaleVariants} // controls maxHeight
      style={{ transformOrigin: "top" }}
    >
      <motion.div
        className={styles.date_selection_inner}
        initial="hidden"
        animate={show ? "visible" : "hidden"}
        variants={opacityVariants} // controls opacity
        typo="h4"
      >
        <div className={styles.range}>
          <div
            className={`${editing === "start" && styles.active} ${styles.label}`}
            onClick={() => setEditing("start")}
          >
            From: {startDate.month && startDate.year ? `${startDate.month} ${startDate.year}` : "-"}
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
            Until: {endDate.month && endDate.year ? `${endDate.month} ${endDate.year}` : "-"}
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

        <div className={styles.controls}>
          <button onClick={handleFilter} disabled={!filterReady} className={filterReady && styles.selected}>
            Search
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DateSelection;
