"use client";

import { CalendarFilterHead } from "@/components/Calendar/Head";
import FilterHeader from "@/components/FilterHeader/FilterHeader";
import { useContext, useEffect, useMemo, useState } from "react";
import { sortEvents } from "../../helpers/Calendar/sortEvents";
import { onSearch } from "../../helpers/Calendar/onSearch";

import CountrySection from "./CountrySection";

import { CSSContext } from "@/context/CSSContext";

import { translate } from "@/helpers/translate";
import { useScrollToHash } from "@/helpers/scrollToHash";
import { useLenisContext } from "@/context/LenisContext";

import styles from "@/components/Calendar/Calendar.module.css";
import filterStyles from "@/components/Calendar/CalendarFilter/CalendarFilter.module.css";

const CalendarArchivePage = ({ events, page }) => {
  const [showFilter, setShowFilter] = useState(false);
  const { header_height, header_height_total, filter_height } = useContext(CSSContext);
  const lenis = useLenisContext();

  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState();

  const [countryInView, setCountryInView] = useState(null);
  const [currentlyInView, setCurrentlyInView] = useState(null);
  const scrollToTop = (top) => {
    if (lenis) {
      const distance = Math.abs((window?.scrollY || 0) - top);
      const duration = Math.min(1.8, Math.max(0.6, distance / 1400));
      lenis.scrollTo(top, { duration });
      return;
    }

    window.scrollTo({ top, behavior: "auto" });
    requestAnimationFrame(() => {
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  useScrollToHash(-header_height_total - 50, [header_height_total]);

  useEffect(() => {
    const targetId = window.location.hash.replace("#", "");
    const el = document.getElementById(targetId);
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add(styles.blink);
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.9, // when 90% visible -> scroll finished
      },
    );

    observer.observe(el);
  }, []);

  const handleFilter = (item) => {
    setSelectedCountry(item);
  };

  useEffect(() => {
    if (selectedCountry) {
      const el = document.getElementById(`country-${selectedCountry}`);
      if (el) {
        const offset = header_height + filter_height + 75;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;

        scrollToTop(top);
      }
    }
  }, [selectedCountry, header_height, filter_height, lenis]);

  const isPast = useMemo(() => {
    const now = new Date();
    return (event) => {
      const end = event.endDate ? new Date(event.endDate) : event.startDate ? new Date(event.startDate) : null;
      return end ? end <= now : true;
    };
  }, []);

  const pastEvents = useMemo(() => events.filter(isPast), [events, isPast]);
  const [filteredEvents, setFilteredEvents] = useState(pastEvents);

  useEffect(() => {
    setFilteredEvents(pastEvents);
  }, [pastEvents]);

  const yearRange = useMemo(() => {
    const years = pastEvents
      .map((event) => {
        const end = event.endDate ? new Date(event.endDate) : event.startDate ? new Date(event.startDate) : null;
        return end && !Number.isNaN(end.getTime()) ? end.getFullYear() : null;
      })
      .filter((year) => typeof year === "number");

    if (years.length === 0) return null;

    return {
      startYear: Math.min(...years),
      endYear: Math.max(...years),
    };
  }, [pastEvents]);

  const handleSearch = (params) => {
    const filtered = onSearch(params, pastEvents, selectedLabels);
    setFilteredEvents(filtered);
  };

  const sortedEvents = filteredEvents.filter(isPast).sort(sortEvents);

  // If you still want them grouped by country afterwards:
  const sortedEntries = Object.entries(
    sortedEvents.reduce((acc, event) => {
      const countryName = translate(event.location?.country?.name);
      (acc[countryName] ??= []).push(event);
      return acc;
    }, {}),
  );

  const countries = sortedEntries.map(([country]) => country);

  return (
    <main className={styles.main} typo="h4">
      <FilterHeader
        array={countries}
        handleFilter={handleFilter}
        currentlyActive={countryInView}
        className={styles.filter_header}
      />
      <CalendarFilterHead
        isArchive={true}
        events={pastEvents}
        className={filterStyles.filterHead}
        onSearch={handleSearch}
        currentlyInView={currentlyInView}
        selectedLabels={selectedLabels}
        setSelectedLabels={setSelectedLabels}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        yearRange={yearRange}
      />

      {sortedEntries.map(([country, events], index) => (
        <CountrySection
          key={country}
          country={country}
          events={events}
          isFirst={index === 0}
          setCountryInView={setCountryInView}
          setCurrentlyInView={setCurrentlyInView}
          header_height={header_height}
          filter_height={filter_height}
        />
      ))}
    </main>
  );
};

export default CalendarArchivePage;
