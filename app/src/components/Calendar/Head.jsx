"use client";

import { useState, useContext } from "react";
import styles from "./Calendar.module.css";

import Row from "@/components/Calendar/Row";
import Cell from "@/components/Calendar/Cell";

import FormatDate from "../FormatDate/FormatDate";
import { LanguageContext } from "@/context/LanguageContext";

import Icon from "../Icon/Icon";

import DateSelection from "./Head/DateSelection";
import CalendarFilterContainer from "./Head/CalendarFilterContainer";
import TagSelection from "./Head/TagSelection";
import { translate } from "@/helpers/translate";

export const Head = () => {
  const { language } = useContext(LanguageContext);
  return (
    <Row className={styles.head}>
      <Cell typo="h5">{language === "en" ? "TITLE" : "TITEL"}</Cell>
      <Cell typo="h5">{language === "en" ? "TIME" : "ZEIT"}</Cell>
      <Cell typo="h5">{language === "en" ? "LOCATION" : "ORT"}</Cell>
    </Row>
  );
};

export const PlainHead = ({ children, className }) => {
  return (
    <Row className={`${className} ${styles.head}`}>
      <Cell typo="h5">{children}</Cell>
    </Row>
  );
};

export const CalendarFilter = ({ events, onSearch, currentlyInView, selectedLabels, setSelectedLabels }) => {
  const { language } = useContext(LanguageContext);

  const [showFilter, setShowFilter] = useState(false);

  const currentMonth = currentlyInView?.endDate
    ? new Intl.DateTimeFormat(language === "en" ? "en-US" : "de-DE", { month: "long" }).format(
        new Date(currentlyInView.endDate)
      )
    : "";

  return (
    <>
      <Row typo="h5" className={`${styles.head} ${styles.filterHead}`}>
        <Cell>
          {currentlyInView?.type ? translate(currentlyInView.type.title) : language === "en" ? "TITLE" : "TITEL"}
        </Cell>
        <Cell>{currentlyInView?.endDate ? currentMonth : language === "en" ? "TIME" : "ZEIT"}</Cell>
        <Cell
          className={styles.selectDates}
          onMouseEnter={() => setShowFilter(true)}
          onMouseLeave={() => setShowFilter(false)}
        >
          <span>{language === "en" ? "SELECT DATE" : "DATUM AUSWÄHLEN"}</span>
          <Icon path="/icons/dropdown-button.svg" className={styles.icon} />
          <CalendarFilterContainer show={showFilter}>
            <DateSelection events={events} onSearch={onSearch} />
            <TagSelection onSearch={onSearch} selectedLabels={selectedLabels} setSelectedLabels={setSelectedLabels} />
          </CalendarFilterContainer>
        </Cell>
      </Row>
    </>
  );
};
