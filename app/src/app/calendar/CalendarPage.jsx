"use client";

import Event from "@/components/Calendar/Event";
import { CalendarFilterHead } from "@/components/Calendar/Head";
import FilterHeader from "@/components/FilterHeader/FilterHeader";
import { useContext, useEffect, useRef, useState } from "react";
import { sortEvents } from "../../helpers/Calendar/sortEvents";
import { onSearch } from "../../helpers/Calendar/onSearch";

import CountrySection from "./CountrySection";

import AdBanner from "@/components/AdBanner/AdBanner";

import { CSSContext } from "@/context/CSSContext";

import { translate } from "@/helpers/translate";
import { scrollToHash } from "@/helpers/scrollToHash";

import { usePathname, useRouter } from "next/navigation";

import styles from "@/components/Calendar/Calendar.module.css";
import filterStyles from "@/components/Calendar/CalendarFilter/CalendarFilter.module.css";

const CalendarPage = ({ events, page }) => {
  const [showFilter, setShowFilter] = useState(false);
  const { header_height, filter_height } = useContext(CSSContext);

  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState();
  const [filteredEvents, setFilteredEvents] = useState(events);

  const [countryInView, setCountryInView] = useState(null);
  const [currentlyInView, setCurrentlyInView] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleHashChange = () => {
      scrollToHash(-(header_height + filter_height + 70 + 50));
    };

    const findHashEvent = () => {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (!el) return;
    };

    window.addEventListener("hashchange", handleHashChange);

    // also run once when loaded with a hash
    handleHashChange();
    findHashEvent();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      router.replace(pathname, { scroll: false });
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const now = new Date();

  // Remove expired events
  const isUpcoming = (event) => {
    const end = event.endDate ? new Date(event.endDate) : event.startDate ? new Date(event.startDate) : null;

    return end ? end >= now : true;
  };

  // If you still want them grouped by country afterwards:
  const sortedEntries = Object.entries(
    sortedEvents.filter(isUpcoming).reduce((acc, event) => {
      const countryName = translate(event.location.country.name);
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
        events={events}
        className={filterStyles.filterHead}
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
