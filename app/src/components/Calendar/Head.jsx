"use client";

import { useContext, useEffect } from "react";
import styles from "./Calendar.module.css";

import filterStyles from "./CalendarFilter/CalendarFilter.module.css";

import Row from "@/components/Calendar/Row";
import Cell from "@/components/Calendar/Cell";

import { LanguageContext } from "@/context/LanguageContext";
import { StateContext } from "@/context/StateContext";

import Icon from "../Icon/Icon";

import CalendarFilter from "./CalendarFilter/CalendarFilter";
import CalendarFilterContainer from "./CalendarFilter/CalendarFilterContainer";
import TagSelection from "./CalendarFilter/TagSelection";
import { translate } from "@/helpers/translate";

export const Head = ({ className }) => {
  const { isMobile } = useContext(StateContext);
  const { language } = useContext(LanguageContext);

  return (
    <Row className={`${className} ${styles.head}`}>
      <Cell typo="h5">{language === "en" ? "TITLE" : "TITEL"}</Cell>
      <Cell typo="h5">
        {!isMobile ? (language === "en" ? "TIME" : "ZEIT") : language === "en" ? "TIME, LOCATION" : "ZEIT, ORT"}
      </Cell>
      {!isMobile && <Cell typo="h5">{language === "en" ? "LOCATION" : "ORT"}</Cell>}
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

export const CalendarFilterHead = ({
  events,
  onSearch,
  currentlyInView,
  selectedLabels,
  setSelectedLabels,
  showFilter,
  setShowFilter,
  className,
}) => {
  const { isMobile, isTouch } = useContext(StateContext);
  const { language } = useContext(LanguageContext);

  const currentMonth = currentlyInView?.endDate
    ? new Intl.DateTimeFormat(language === "en" ? "en-US" : "de-DE", { month: "long" }).format(
        new Date(currentlyInView.endDate),
      )
    : "";

  useEffect(() => {
    if (!showFilter || !isMobile) return;

    const handleScroll = () => {
      setShowFilter(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showFilter, isMobile]);

  const handleDropdownClick = (e) => {
    if (!isTouch) return;

    console.log("clicked the button");
    setShowFilter((prev) => !prev);
  };

  return (
    <>
      <Row typo="h5" className={`${styles.head} ${filterStyles.filterHead} ${showFilter ? filterStyles.showFilter : ""}`}>
        <Cell className={filterStyles.calendar_filter_title}>
          {currentlyInView?.type ? translate(currentlyInView.type.title) : language === "en" ? "TITLE" : "TITEL"}
        </Cell>
        <Cell className={filterStyles.calendar_filter_time}>
          {currentlyInView?.endDate ? currentMonth : language === "en" ? "TIME" : "ZEIT"}
        </Cell>
        <Cell
          className={`${filterStyles.selectDates} ${styles.selectDates}`}
          onMouseEnter={() => {
            if (!isMobile) setShowFilter(true);
          }}
          // onMouseLeave={() => {
          //   if (!isMobile) setShowFilter(false);
          // }}
          onClick={() => {
            if (!showFilter) setShowFilter(true);
          }}
        >
          <span>{!isMobile ? (language === "en" ? "SELECT DATE" : "DATUM AUSWÄHLEN") : "FILTER"}</span>
          <Icon
            path="/icons/dropdown-button.svg"
            className={filterStyles.dropdownIcon}
            onClick={(e) => handleDropdownClick(e)}
          />
          <CalendarFilterContainer showFilter={showFilter} className={className}>
            <CalendarFilter
              className={className}
              events={events}
              onSearch={onSearch}
              setShowFilter={setShowFilter}
              setSelectedLabels={setSelectedLabels}
              selectedLabels={selectedLabels}
            />
          </CalendarFilterContainer>
        </Cell>
      </Row>
    </>
  );
};
