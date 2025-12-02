"use client";

import styles from "./CalendarPage.module.css";
import Event from "@/components/Calendar/Event";
import { Head, CalendarFilter } from "@/components/Calendar/Head";
import FilterHeader from "@/components/FilterHeader/FilterHeader";
import { useContext, useEffect, useRef, useState } from "react";
import { sortEvents } from "../../helpers/Calendar/sortEvents";
import { onSearch } from "../../helpers/Calendar/onSearch";
import CountrySection from "./CountrySection";

import { useInView, motion } from "framer-motion";

import AdBanner from "@/components/AdBanner/AdBanner";

import { CSSContext } from "@/context/CSSContext";

import { translate } from "@/helpers/translate";
import { scrollToHash } from "@/helpers/scrollToHash";

const CalendarPage = ({ events, page }) => {
  const [hasFiltered, setHasFiltered] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const { header_height, filter_height } = useContext(CSSContext);

  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState();
  const [filteredEvents, setFilteredEvents] = useState(events);

  const [countryInView, setCountryInView] = useState(null);
  const [currentlyInView, setCurrentlyInView] = useState(null);

  const yearRefs = useRef({});

  useEffect(() => {
    scrollToHash(-1 * (header_height + filter_height + 70 + 50));
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

        console.log("scrolling to country!");
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }, [selectedCountry]);

  const handleSearch = (params) => {
    const filtered = onSearch(params, events, selectedLabels);
    setFilteredEvents(filtered);
  };

  const hosted = events.filter((event) => event.highlight?.hosted);

  // 🧹 Exclude hosted events before sorting
  const sortedEvents = filteredEvents.filter((event) => !event.highlight?.hosted).sort(sortEvents);

  // If you still want them grouped by country afterwards:
  const sortedEntries = Object.entries(
    sortedEvents.reduce((acc, event) => {
      const countryName = translate(event.location.country.name);
      (acc[countryName] ??= []).push(event);
      return acc;
    }, {})
  );

  // If you still want a list of country names
  const countries = sortedEntries.map(([country]) => country);

  return (
    <main className={styles.main} typo="h4">
      <FilterHeader
        array={countries}
        handleFilter={handleFilter}
        currentlyActive={countryInView}
        className={styles.filter_header}
      />
      <CalendarFilter
        events={events}
        className={styles.filterHead}
        onSearch={handleSearch}
        currentlyInView={currentlyInView}
        selectedLabels={selectedLabels}
        setSelectedLabels={setSelectedLabels}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
      />

      <section>
        <div className={styles.calendar}>
          <ul>
            {hosted.map((event, index, array) => (
              <Event key={index} event={event} index={index} array={array} setCurrentlyInView={setCurrentlyInView} />
            ))}
          </ul>
        </div>
      </section>

      <AdBanner adBanner={page.adBanner} />

      {sortedEntries.map(([country, events], index) => (
        <CountrySection
          key={country}
          country={country}
          events={events}
          setCountryInView={setCountryInView}
          setCurrentlyInView={setCurrentlyInView}
          header_height={header_height}
          filter_height={filter_height}
        />
      ))}
    </main>
  );
};

export default CalendarPage;
