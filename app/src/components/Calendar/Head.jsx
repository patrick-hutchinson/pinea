"use client";

import { useState } from "react";
import styles from "./Calendar.module.css";

import Row from "@/components/Calendar/Row";
import Cell from "@/components/Calendar/Cell";

import Icon from "../Icon";

import DateSelection from "./Head/DateSelection";

export const Head = () => {
  return (
    <Row className={styles.head}>
      <Cell typo="h5">TITLE</Cell>
      <Cell typo="h5">TIME</Cell>
      <Cell typo="h5">LOCATION</Cell>
    </Row>
  );
};

export const FilterHead = ({ events }) => {
  const [showDates, setShowDates] = useState(false);

  return (
    <Row typo="h5" className={`${styles.head} ${styles.filterHead}`}>
      <Cell>FILTER</Cell>
      <Cell>TIME</Cell>
      <Cell className={styles.selectDates}>
        <span>SELECT DATE</span>
        <Icon path="/icons/dropdown-button.svg" className={styles.icon} onClick={() => setShowDates((prev) => !prev)} />
        {showDates && <DateSelection events={events} />}
      </Cell>
    </Row>
  );
};
