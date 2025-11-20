import Label from "@/components/Label/Label";
import { useState, useEffect } from "react";

import styles from "../Calendar.module.css";

const TagSelection = () => {
  const [selectedLabels, setSelectedLabels] = useState([]); // empty = all active
  const allLabels = ["HOSTED", "RECOMMENDED", "PINNED"];

  //   Update labels
  const handleToggleLabel = (label) => {
    setSelectedLabels((prev) => {
      if (prev.includes(label)) {
        return prev.filter((l) => l !== label);
      } else {
        return [...prev, label];
      }
    });
  };

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
    <div style={{ position: "absolute", bottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
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
