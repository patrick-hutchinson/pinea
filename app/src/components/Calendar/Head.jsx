"use client";

import { useState } from "react";
import styles from "./Calendar.module.css";

import Row from "@/components/Calendar/Row";
import Cell from "@/components/Calendar/Cell";

import FormatDate from "../FormatDate/FormatDate";

import Icon from "../Icon/Icon";

import DateSelection from "./Head/DateSelection";
import CalendarFilterContainer from "./Head/CalendarFilterContainer";
import { translate } from "@/helpers/translate";

export const Head = () => {
  return (
    <Row className={styles.head}>
      <Cell typo="h5">TITLE</Cell>
      <Cell typo="h5">TIME</Cell>
      <Cell typo="h5">LOCATION</Cell>
    </Row>
  );
};

export const PlainHead = ({ children }) => {
  return (
    <Row className={styles.head}>
      <Cell typo="h5">{children}</Cell>
    </Row>
  );
};

export const CalendarFilter = ({ events, onSearch, currentlyInView }) => {
  const [showFilter, setShowFilter] = useState(false);
  const currentMonth = <FormatDate date={currentlyInView?.endDate} format={{ month: "long" }} />;

  return (
    <>
      <Row typo="h5" className={`${styles.head} ${styles.filterHead}`}>
        <Cell>{currentlyInView?.type ? translate(currentlyInView.type.title) : "TITLE"}</Cell>
        <Cell>{currentlyInView?.endDate ? currentMonth : "TIME"}</Cell>
        <Cell
          className={styles.selectDates}
          onMouseEnter={() => setShowFilter(true)}
          onMouseLeave={() => setShowFilter(false)}
        >
          <span>SELECT DATE</span>
          <Icon path="/icons/dropdown-button.svg" className={styles.icon} />
          <CalendarFilterContainer show={showFilter}></CalendarFilterContainer>
          {/* <DateSelection events={events} onSearch={onSearch} show={showDates} /> */}
        </Cell>
      </Row>
    </>
  );
};
