"use client";

import { useState, useEffect } from "react";

import { scrollToHash } from "@/helpers/scrollToHash";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import Media from "@/components/Media/Media";
import MediaPair from "@/components/MediaPair/MediaPair";

import Recommendation from "@/components/People/Recommendation";
import CurrentEvent from "@/components/People/CurrentEvent";
import PersonInfo from "@/components/People/PersonInfo";

import styles from "./PersonPage.module.css";
import Label from "@/components/Label/Label";

import { useRouter } from "next/navigation";

const PersonPage = ({ people, person }) => {
  const router = useRouter();

  const recommendations = person.recommendations;

  const [currentEvent, setCurrentEvent] = useState(recommendations[0].event);
  const currentIndex = recommendations.findIndex((r) => r.event._id === currentEvent._id);

  const names = people.filter((person) => person.name).map((person) => person.name);

  // Scroll to the correct comment if there is a hash in the url

  // ⚠️ Not sure about the hardcoded offset here
  useEffect(() => {
    scrollToHash(-75); // pass your desired offset
  }, []);

  const handleFilter = (item) => {
    const person = people.find((person) => person.name === item);

    if (person) {
      const slug = person.slug.current;
      console.log("Navigating to:", slug);
      // For example, if you're using Next.js router:
      router.push(`/people/${slug}`);
    }
  };

  return (
    <main className={styles.main}>
      <FilterHeader array={names} handleFilter={handleFilter} className={styles.filter_header} />

      <section style={{ overflow: "visible" }}>
        <Label className={styles.counter}>{`${currentIndex + 1}/${recommendations.length} TIPS`}</Label>
        <MediaPair>
          <div>
            <hr className={styles.divider} />
            <div className={styles.text_column}>
              <ul>
                {person.recommendations.map((rec) => (
                  <Recommendation key={rec._id} recommendation={rec} setCurrentEvent={setCurrentEvent} />
                ))}
              </ul>
              <br />
              <PersonInfo person={person} />
            </div>
          </div>

          <div className={styles.portrait}>
            <Media medium={person.portrait.medium} />
          </div>
        </MediaPair>

        <CurrentEvent event={currentEvent} />
      </section>
    </main>
  );
};

export default PersonPage;
