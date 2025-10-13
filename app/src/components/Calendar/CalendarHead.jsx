"use client";

import { useState } from "react";
import styles from "./Calendar.module.css";
import { motion, AnimatePresence } from "framer-motion";

export const CalendarHead = () => {
  return (
    <div className={`${styles.row} ${styles.header}`}>
      <h5 className={`${styles.cell} `}>TITLE</h5>
      <h5 className={`${styles.cell} ${styles.time}`}>TIME</h5>
      <h5 className={`${styles.cell} ${styles.location}`}>LOCATION</h5>
    </div>
  );
};

export const FilterHead = ({ events }) => {
  const [showDates, setShowDates] = useState(false);
  const years = [
    ...new Set(
      events.flatMap((event) => {
        const years = [];
        if (event.startDate) years.push(new Date(event.startDate).getFullYear());
        if (event.endDate) years.push(new Date(event.endDate).getFullYear());
        return years;
      })
    ),
  ].sort((a, b) => a - b);

  const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString("en", { month: "long" }));

  const DateSelection = () => {
    return (
      <AnimatePresence key="date-selection">
        <motion.div className={styles.dates} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ul>
            <li>Start Date</li>
            <li>End Date</li>
          </ul>

          <fieldset className={styles.months}>
            {months.map((month, index) => (
              <span key={index}>
                <button>{month}</button>
              </span>
            ))}
          </fieldset>

          <fieldset className={styles.years}>
            {years.map((year, index) => (
              <span key={index}>
                <button>{year}</button>
              </span>
            ))}
          </fieldset>

          <button>SELECT</button>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className={`${styles.row} ${styles.header} ${styles.filterHead}`}>
      <h5 className={`${styles.cell} `}>FILTER</h5>
      <h5 className={`${styles.cell} ${styles.time}`}>TIME</h5>
      <div
        className={`${styles.cell} ${styles.date}`}
        onMouseEnter={() => setShowDates(true)}
        onMouseLeave={() => setShowDates(false)}
      >
        <h5>SELECT DATE</h5>
        {showDates && <DateSelection />}
      </div>
    </div>
  );
};
