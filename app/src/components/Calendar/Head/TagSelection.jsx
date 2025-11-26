import Label from "@/components/Label/Label";
import { useState, useEffect } from "react";

import styles from "../Calendar.module.css";

const TagSelection = ({ onSearch, selectedLabels, setSelectedLabels }) => {
  //   const [selectedLabels, setSelectedLabels] = useState([]); // empty = all active
  const allLabels = ["RECOMMENDED", "PINNED"];

  //   Update labels
  const handleToggleLabel = (label) => {
    setSelectedLabels((prev) => {
      let newLabels;

      if (prev.includes(label)) {
        // remove label
        newLabels = prev.filter((l) => l !== label);
        // if removing last label, none active
        if (newLabels.length === 0) newLabels = [];
      } else {
        // add label
        newLabels = [...prev, label];
        // if now all labels selected, reset to all active
        if (newLabels.length === allLabels.length) newLabels = [];
      }

      // Return new labels state
      return newLabels;
    });
  };

  // Run onSearch **whenever selectedLabels changes**
  useEffect(() => {
    onSearch({ startDate: null, endDate: null }); // adjust params if needed
  }, [selectedLabels]);

  //   Run onSearch whenever labels or date range changes
  //   useEffect(() => {
  //     onSearch?.(
  //       {
  //         startDate: startDate.month && startDate.year ? startDate : null,
  //         endDate: endDate.month && endDate.year ? endDate : null,
  //       },
  //       events,
  //       selectedLabels
  //     );
  //   }, [selectedLabels, startDate, endDate, events, onSearch]);

  return (
    <div
      className={styles.tag_selection}
      style={{ position: "absolute", bottom: 10, display: "flex", alignItems: "center", gap: 4 }}
    >
      {allLabels.map((label) => {
        const isActive = selectedLabels.length === 0 || selectedLabels.includes(label); // empty = all active
        return (
          <Label
            key={label}
            outline={true}
            className={`${styles.label} ${isActive ? styles.selected : ""}`}
            onClick={() => handleToggleLabel(label)}
          >
            {label}
          </Label>
        );
      })}
    </div>
  );
};

export default TagSelection;
