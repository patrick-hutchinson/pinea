"use client";

import styles from "./CalendarPage.module.css";
import Event from "@/components/Calendar/Event";
import { Head } from "@/components/Calendar/Head";
import { FilterHead } from "@/components/Calendar/Head";
import Filters from "@/components/Filters";
import { useEffect, useState } from "react";

const CalendarPage = ({ events }) => {
  const pinned = events.filter((event) => event.pinned);

  const eventsByCountry = events.reduce((acc, event) => {
    (acc[event.country.name] ??= []).push(event);
    return acc;
  }, {});

  const countries = Object.keys(eventsByCountry);

  const [activeFilter, setActiveFilter] = useState();

  useEffect(() => {
    if (activeFilter) {
      const el = document.getElementById(`country-${activeFilter}`);
      if (el) {
        const offset = 150; // adjust this value for your header height, etc.
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }, [activeFilter]);

  return (
    <main className={styles.main} typo="h4">
      <Filters className={styles.countries_filter} array={countries} setActiveFilter={setActiveFilter} />
      <FilterHead events={events} className={styles.filterHead} />

      <section>
        <div className={styles.calendar}>
          <ul>
            {pinned.map((event, index, array) => {
              return <Event key={index} event={event} index={index} array={array} />;
            })}
          </ul>
        </div>
      </section>

      {Object.entries(eventsByCountry).map(([country, events]) => {
        console.log(events, "events");
        return (
          <section key={country}>
            <h3 id={`country-${country}`}>{country}</h3>

            <div className={styles.calendar}>
              <Head />
              <ul>
                {events.map((event, index) => (
                  <Event key={index} event={event} index={index} array={events} />
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </main>
  );
};

export default CalendarPage;
