import { useRef } from "react";

import styles from "../CalendarFilter.module.css";

import FadeOverflow from "@/components/Animation/FadeOverflow/FadeOverflow";

const FilterDays = ({ draftDate, setDraftDate }) => {
  const scrollContainer = useRef(null);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  function isValidDay(year, month, day) {
    return day <= new Date(year, month + 1, 0).getDate();
  }

  // Only enable days if month & year are selected
  const monthSelected = draftDate?.month != null;
  const yearSelected = draftDate?.year != null;

  return (
    <div style={{ position: "relative" }} data-lenis-prevent>
      <FadeOverflow scrollContainer={scrollContainer} backgroundColor="var(--foreground)">
        <div ref={scrollContainer} className={styles.days}>
          {days.map((day) => {
            const valid = isValidDay(draftDate.year, draftDate.month, day);
            const disabled = !monthSelected || !yearSelected || !valid;

            return (
              <button
                key={day}
                disabled={disabled}
                className={disabled ? styles.disabled : ""}
                onClick={() => !disabled && setDraftDate((prev) => ({ ...prev, day: day }))}
              >
                {day}
              </button>
            );
          })}
        </div>
      </FadeOverflow>
    </div>
  );
};

export default FilterDays;
