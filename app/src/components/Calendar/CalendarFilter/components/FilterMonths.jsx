import { useRef } from "react";

import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

import FadeOverflow from "@/components/Animation/FadeOverflow/FadeOverflow";

import styles from "../CalendarFilter.module.css";

const FilterMonths = ({ draftDate, setDraftDate }) => {
  const scrollContainer = useRef(null);

  const { language } = useContext(LanguageContext);

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString(language === "de" ? "de-AT" : "en-US", { month: "long" }),
  );

  return (
    <div style={{ position: "relative" }} data-lenis-prevent>
      <FadeOverflow scrollContainer={scrollContainer} backgroundColor="var(--foreground)">
        <div ref={scrollContainer} className={styles.months}>
          {months.map((month, index) => {
            const isActive = draftDate.month === index; // check if this month is selected

            return (
              <button
                key={index}
                className={isActive ? styles.active : ""}
                onClick={() => setDraftDate((prev) => ({ ...prev, month: index }))}
              >
                {month}
              </button>
            );
          })}
        </div>
      </FadeOverflow>
    </div>
  );
};

export default FilterMonths;
