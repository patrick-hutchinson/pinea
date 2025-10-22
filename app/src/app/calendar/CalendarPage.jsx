"use client";

import styles from "./CalendarPage.module.css";
import Event from "@/components/Calendar/Event";
import { Head, CalendarFilter } from "@/components/Calendar/Head";
import FilterHeader from "@/components/FilterHeader";
import { useEffect, useState } from "react";

import AdBanner from "@/components/AdBanner";

import { translate } from "@/helpers/translate";

const CalendarPage = ({ events }) => {
  const [activeFilter, setActiveFilter] = useState();
  const [filteredEvents, setFilteredEvents] = useState(events);

  useEffect(() => {
    if (activeFilter) {
      const el = document.getElementById(`country-${activeFilter}`);
      if (el) {
        const offset = 150;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }, [activeFilter]);

  const onSearch = (params) => {
    if (!params || !params.startDate || !params.endDate) {
      // Reset case → clear filters
      setFilteredEvents(events);
      return;
    }

    const { startDate, endDate } = params;

    const startMonth = startDate.month;
    const endMonth = endDate.month;
    const startYear = startDate.year;
    const endYear = endDate.year;

    const from = new Date(`${startMonth} 1, ${startYear}`);
    let to = new Date(`${endMonth} 1, ${endYear}`);
    to.setMonth(to.getMonth() + 1);
    to.setDate(0); // last day of end month

    const filtered = events.filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate || event.startDate);

      console.log(start, to, end, from, "list");
      return start <= to && end >= from; // overlaps range
    });

    setFilteredEvents(filtered);
  };

  const hosted = events.filter((event) => event.highlight?.hosted);

  // Helper to compute exhibition duration in milliseconds
  const getDuration = (event) => new Date(event.endDate) - new Date(event.startDate);

  // Sorting helper

  const sortEvents = (a, b) => {
    const countryA = translate(a.location.country.name);
    const countryB = translate(b.location.country.name);
    const isAustriaA = countryA.toLowerCase().includes("austria") || countryA.toLowerCase().includes("österreich");
    const isAustriaB = countryB.toLowerCase().includes("austria") || countryB.toLowerCase().includes("österreich");

    if (isAustriaA && !isAustriaB) return -1;
    if (isAustriaB && !isAustriaA) return 1;

    const countryCompare = countryA.localeCompare(countryB);
    if (countryCompare !== 0) return countryCompare;

    const cityA = translate(a.location.city || "");
    const cityB = translate(b.location.city || "");
    const cityCompare = cityA.localeCompare(cityB);
    if (cityCompare !== 0) return cityCompare;

    const instA = translate(a.location.institution || "");
    const instB = translate(b.location.institution || "");
    const instCompare = instA.localeCompare(instB);
    if (instCompare !== 0) return instCompare;

    const durA = getDuration(a);
    const durB = getDuration(b);
    return durA - durB;
  };

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
      <FilterHeader className={styles.countries_filter} array={countries} setActiveFilter={setActiveFilter} />
      <CalendarFilter events={events} className={styles.filterHead} onSearch={onSearch} />

      <section>
        <div className={styles.calendar}>
          <ul>
            {hosted.map((event, index, array) => (
              <Event key={index} event={event} index={index} array={array} />
            ))}
          </ul>
        </div>
      </section>

      {sortedEntries.map(([country, events], index) => (
        <div
          style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "150px" }}
          key={index}
        >
          <section key={country}>
            <h3 style={{ textTransform: "uppercase" }} id={`country-${country}`}>
              {country}
            </h3>

            <div className={styles.calendar}>
              <Head />
              <ul>
                {events.map((event, index) => (
                  <Event key={index} event={event} index={index} array={events} />
                ))}
              </ul>
            </div>
          </section>
          <AdBanner />
        </div>
      ))}
    </main>
  );
};

export default CalendarPage;
